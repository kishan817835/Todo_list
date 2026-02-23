import { Component, OnInit } from '@angular/core';
import { Api } from '../../service/api';
import { Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { SecureLs } from '../../secure-ls';
import { ChangeDetectorRef } from '@angular/core';
import { QuillModule } from 'ngx-quill';
import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';

interface Task {
  _id: string;
  title: string;
  description: string;
  priority: 'low' | 'medium' | 'high';
  status: 'pending' | 'in-progress' | 'completed';
  dueDate: string;
  deadlineTime: string;
  order: number;
  completedAt?: string;
  createdAt: string;
  days?: number;
  visibility?: 'public' | 'private';
}

interface User {
  id: string;
  name: string;
  username: string;
  email: string;
  role: string;
}

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.html',
  styleUrls: ['./dashboard.css'],
  imports: [CommonModule, FormsModule, QuillModule],
  schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class Dashboard {
  tasks: Task[] = [];
  filteredTasks: Task[] = [];
  
  newTask = {
    title: '',
    description: '',
    priority: 'medium' as 'low' | 'medium' | 'high',
    dueDate: '',
    deadlineTime: ''
  };
  mailNotification: boolean = false; 

  editingTask: Task | null = null;
  
  filters = {
    status: '',
    priority: ''
  };
  
  userProfile: User | null = null;
  
  isProfileMenuOpen = false;
  isLoading = false;
  showPopup = false;
  popupMessage = '';
  showAllTasks = false;

  // Multiple Email Properties
  showMultipleEmailPopup: boolean = false;
  multipleEmails: string[] = [];
  newEmail: string = '';

  priorityOptions = [
    { value: 'low', label: 'Low', color: 'bg-green-100 text-green-800' },
    { value: 'medium', label: 'Medium', color: 'bg-yellow-100 text-yellow-800' },
    { value: 'high', label: 'High', color: 'bg-red-100 text-red-800' }
  ];
  
  statusOptions = [
    { value: 'pending', label: 'Pending', color: 'bg-gray-100 text-gray-800' },
    { value: 'in-progress', label: 'In Progress', color: 'bg-blue-100 text-blue-800' },
    { value: 'completed', label: 'Completed', color: 'bg-green-100 text-green-800' }
  ];
  
  quillConfig = {
    toolbar: [
      ['bold', 'italic', 'underline', 'strike'],
      ['blockquote', 'code-block'],
      [{ 'list': 'ordered'}, { 'list': 'bullet' }],
      [{ 'header': [1, 2, 3, false] }],
      [{ 'color': [] }, { 'background': [] }],
      ['clean']
    ],
    placeholder: 'Enter task description...',
    theme: 'snow'
  };
  
  constructor(
    private api: Api,
    private router: Router,
    private secureLs: SecureLs,
    private cdr: ChangeDetectorRef
  ) {}
  totalTasks: number = 0;
  pendingTasks: number = 0;
  completedTasks: number = 0;
  
  ngAfterViewInit() {
    this.loadUserProfile();
    this.loadRecentTasks();
    this.loadSavedEmails();
  }
  
  loadUserProfile() {
    const user = this.secureLs.get('user');
    if (user) {
      this.userProfile = user;
    }
  }

  loadSavedEmails() {
    const savedEmails = this.secureLs.get('multipleEmails') || [];
    this.multipleEmails = savedEmails;
  }

  onMailToggle() {
    console.log("Mail Notification:", this.mailNotification);
  }

  loadRecentTasks() {
  this.isLoading = true;

  this.api.getrecenttasks().subscribe({
    next: (response: any) => {
      
      this.totalTasks = response.counts.total;
      this.pendingTasks = response.counts.pending;
      this.completedTasks = response.counts.completed;
      
      this.tasks = response.data || [];
      this.filteredTasks = [...this.tasks];

      
      
  
      this.isLoading = false;
      this.cdr.detectChanges();
    },
    error: (error) => {
      console.error('Error loading recent tasks:', error);
      this.showMessage('Failed to load recent tasks');
      this.isLoading = false;
      this.cdr.detectChanges();
    }
  });
}

  
  createTask() {
    if (!this.newTask.title.trim()) {
      this.showMessage('Please enter task title');
      return;
    }
    if(!this.newTask.dueDate){
      this.showMessage('Please enter due date');
      return;
    }
    if(this.mailNotification){
     if(!this.newTask.deadlineTime){
      this.showMessage('Please enter deadline time');
      return;
     }
    }

    console.log(this.newTask);
    
    // Add multiple emails to the task if mail notification is ON
    const taskData = {
      ...this.newTask,
      multipleEmails: this.mailNotification ? (this.secureLs.get('multipleEmails') || []) : []
    };
    
    this.api.createTask(taskData).subscribe({
      next: (response: any) => {
        if (response.success) {
          this.tasks.push(response.data);
          this.filteredTasks = [...this.tasks];
          this.resetNewTaskForm();
          this.showMessage('Task created successfully');
          this.cdr.detectChanges();
          setTimeout(() => {
            this.loadRecentTasks();
          }, 100);
        }
      },
      error: (error) => {
        console.error('Error creating task:', error);
        this.showMessage(error?.error?.message || 'Failed to create task');
      }
    });
  }
  
  updateTask() {
    if (!this.editingTask) return;
    
    const updateData = { ...this.editingTask };
    
    if (updateData.status === 'completed' && !updateData.completedAt) {
      updateData.completedAt = new Date().toISOString();
    } else if (updateData.status !== 'completed') {
      updateData.completedAt = undefined;
    }
    
    this.api.updateTask(this.editingTask._id, updateData).subscribe({
      next: (response: any) => {
        if (response.success) {
          const index = this.tasks.findIndex(t => t._id === this.editingTask?._id);
          if (index !== -1) {
            this.tasks[index] = response.data;
            this.filteredTasks = [...this.tasks];
          }
          this.editingTask = null;
          this.showMessage('Task updated successfully');
          this.cdr.detectChanges();
          setTimeout(() => {
            this.loadRecentTasks();
          }, 100);
        }
      },
      error: (error) => {
        console.error('Error updating task:', error);
        this.showMessage(error?.error?.message || 'Failed to update task');
      }
    });
  }
  
  deleteTask(taskId: string) {
    if (!confirm('Are you sure you want to delete this task?')) return;
    
    this.api.deleteTask(taskId).subscribe({
      next: (response: any) => {
        if (response.success) {
          this.tasks = this.tasks.filter(task => task._id !== taskId);
          this.filteredTasks = [...this.tasks];
          this.showMessage('Task deleted successfully');
          this.cdr.detectChanges();
          setTimeout(() => {
            this.loadRecentTasks();
          }, 100);
        }
      },
      error: (error) => {
        console.error('Error deleting task:', error);
        this.showMessage(error?.error?.message || 'Failed to delete task');
        this.cdr.detectChanges();
      }
    });
  }
  
  startEdit(task: Task) {
    this.editingTask = { ...task };
  }
  
  viewTaskDetail(taskId: string) {
    const task = this.tasks.find(t => t._id === taskId);
    if (task) {
      if (task.visibility === 'public') {
        this.router.navigate(['/task/public', taskId]);
      } else {
        this.router.navigate(['/task', taskId]);
      }
    } else {
      this.router.navigate(['/task', taskId]);
    }
  }
  
  cancelEdit() {
    this.editingTask = null;
  }


TaskVisibility(task: Task) {
  const newVisibility = task.visibility === 'public' ? 'private' : 'public';
  const payload = {
    taskId: task._id,
    visibility: newVisibility
  };

  this.api.Taskvisibility(task._id, payload).subscribe({
    next: (response: any) => {
      if (response.success) {
        const index = this.tasks.findIndex(t => t._id === task._id);
        if (index !== -1) {
          this.tasks[index] = response.data;
          this.filteredTasks = [...this.tasks];
          this.showMessage('Task visibility updated successfully');
        }
      }
    },
    error: (error: any) => {
      console.error('Error updating task visibility:', error);
      this.showMessage('Failed to update task visibility');
    }
  });
}

  
  toggleTaskStatus(task: Task) {
    const newStatus = task.status === 'completed' ? 'pending' : 'completed';
    const updateData = { status: newStatus };
    
    this.api.updateTask(task._id, updateData).subscribe({
      next: (response: any) => {
        if (response.success) {
          const index = this.tasks.findIndex(t => t._id === task._id);
          this.showPopup = true;
           this.showMessage('Task status updated successfully');
          this.cdr.detectChanges();
          setTimeout(() => {
            this.loadRecentTasks();
          }, 100);
          
          if (index !== -1) {
            this.tasks[index] = response.data;
            this.filteredTasks = [...this.tasks];
            this.cdr.detectChanges();
          }
        }
      },
      error: (error) => {
        console.error('Error toggling task status:', error);
        this.showMessage('Failed to update task status');
      }
    });
  }
  
  reorderTasks() {
    const updates = this.tasks.map((task, index) => ({
      id: task._id,
      order: index + 1
    }));
    
    this.api.reorderTasks(updates).subscribe({
      next: (response: any) => {
        if (response.success) {
          this.showMessage('Tasks reordered successfully');
        }
      },
      error: (error) => {
        console.error('Error reordering tasks:', error);
        this.showMessage('Failed to reorder tasks');
      }
    });
  }
  
  getTaskDays(taskId: string) {
    this.api.getTaskDaysCount(taskId).subscribe({
      next: (response: any) => {
        if (response.success) {
          const index = this.tasks.findIndex(t => t._id === taskId);
          if (index !== -1) {
            this.tasks[index].days = response.days;
            this.filteredTasks = [...this.tasks];
          }
        }
      },
      error: (error) => {
        console.error('Error getting task days:', error);
      }
    });
  }
  
  applyFilters() {
    this.loadRecentTasks();
  }
  
  resetFilters() {
    this.filters.status = '';
    this.filters.priority = '';
    this.loadRecentTasks();
  }
  
  resetNewTaskForm() {
    this.newTask = {
      title: '',
      deadlineTime: '',
      description: '',
      priority: 'medium',
      dueDate: ''
    };
  }
  
  showMessage(message: string) {
    this.popupMessage = message;
    this.showPopup = true;
    setTimeout(() => {
      this.closePopup();
    }, 3000);
  }
  
  closePopup() {
    this.showPopup = false;
    this.cdr.detectChanges();
  }
  
  getPriorityClass(priority: string) {
    const option = this.priorityOptions.find(p => p.value === priority);
    return option ? option.color : 'bg-gray-100 text-gray-800';
  }
  
  getStatusClass(status: string) {
    const option = this.statusOptions.find(s => s.value === status);
    return option ? option.color : 'bg-gray-100 text-gray-800';
  }
  
  formatDate(dateString: string) {
    if (!dateString) return 'No due date';
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  }
  
  logout() {
    this.secureLs.clear();
    this.router.navigate(['/login']);
  }
  
  getTasksByStatus(status: string) {
    return this.tasks.filter(task => task.status === status).length;
  }
  
  getTotalTasks() {
    return this.tasks.length;
  }
  
  getCompletedTasks() {
    return this.tasks.filter(task => task.status === 'completed').length;
  }
  
  getPendingTasks() {
    return this.tasks.filter(task => task.status !== 'completed').length;
  }
  
  viewAllTasks() {
    this.showAllTasks = true;
    this.isLoading = true;
    
    this.api.getTasks().subscribe({
      next: (response: any) => {
        this.tasks = response.data || [];
        this.filteredTasks = [...this.tasks];
        this.isLoading = false;
        this.cdr.detectChanges();
      },
      error: (error) => {
        console.error('Error loading all tasks:', error);
        this.showMessage('Failed to load all tasks');
        this.isLoading = false;
        this.cdr.detectChanges();
      }
    });
  }
  
  viewRecentTasks() {
    this.showAllTasks = false;
    this.loadRecentTasks();
  }

  openMultipleEmailPopup() {
    this.showMultipleEmailPopup = true;
  }

  closeMultipleEmailPopup() {
    this.showMultipleEmailPopup = false;
    // Don't clear newEmail, keep it for next time
    this.cdr.detectChanges();
  }

  addEmail() {
    if (!this.newEmail.trim()) {
      this.showMessage('Please enter an email address');
      return;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(this.newEmail)) {
      this.showMessage('Please enter a valid email address');
      return;
    }

    if (this.multipleEmails.includes(this.newEmail.toLowerCase())) {
      this.showMessage('This email is already added');
      return;
    }

    this.multipleEmails.push(this.newEmail.toLowerCase());
    this.newEmail = '';
    this.cdr.detectChanges();
  }

  removeEmail(index: number) {
    this.multipleEmails.splice(index, 1);
    this.cdr.detectChanges();
  }

  saveMultipleEmails() {
    // Save to local storage or send to backend
    this.secureLs.set('multipleEmails', this.multipleEmails);
    this.showMessage(`${this.multipleEmails.length} email(s) saved for reminders`);
    this.closeMultipleEmailPopup();
  }
}