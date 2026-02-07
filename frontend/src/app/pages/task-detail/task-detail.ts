import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Api } from '../../service/api';
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
  selector: 'app-task-detail',
  templateUrl: './task-detail.html',
  styleUrls: ['./task-detail.css'],
  imports: [CommonModule, FormsModule, QuillModule],
  schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class TaskDetail implements OnInit {
  task: Task | null = null;
  taskId: string = '';
  isLoading: boolean = true;
  userProfile: User | null = null;
  showPopup: boolean = false;
  popupMessage: string = '';

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

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private api: Api,
    private secureLs: SecureLs,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit() {
    this.loadUserProfile();
    
    // Check if user is authenticated
    const token = this.secureLs.get('token');
    if (!token) {
      this.router.navigate(['/login']);
      return;
    }
    
    this.taskId = this.route.snapshot.paramMap.get('id') || '';
    if (this.taskId) {
      this.loadTaskDetail();
    } else {
      this.showMessage('Task ID not found');
      this.router.navigate(['/dashboard']);
    }
  }

  loadUserProfile() {
    const user = this.secureLs.get('user');
    if (user) {
      this.userProfile = user;
    }
  }

  loadTaskDetail() {
    this.isLoading = true;
    this.api.getTaskById(this.taskId).subscribe({
      next: (response: any) => {
        if (response.success) {
          this.task = response.data;
        } else {
          this.showMessage('Task not found');
          this.router.navigate(['/dashboard']);
        }
        this.isLoading = false;
        this.cdr.detectChanges();
      },
      error: (error) => {
        console.error('Error loading task detail:', error);
        this.showMessage('Failed to load task details');
        this.isLoading = false;
        this.cdr.detectChanges();
      }
    });
  }

  goBack() {
    this.router.navigate(['/dashboard']);
  }

  editTask() {
    if (this.task) {
      this.router.navigate(['/dashboard'], { 
        queryParams: { editTask: this.task._id } 
      });
    }
  }

  deleteTask() {
    if (!this.task) return;
    
    if (confirm('Are you sure you want to delete this task?')) {
      this.api.deleteTask(this.task._id).subscribe({
        next: (response: any) => {
          if (response.success) {
            this.showMessage('Task deleted successfully');
            setTimeout(() => {
              this.router.navigate(['/dashboard']);
            }, 1500);
          }
        },
        error: (error) => {
          console.error('Error deleting task:', error);
          this.showMessage(error?.error?.message || 'Failed to delete task');
        }
      });
    }
  }

  toggleTaskStatus() {
    if (!this.task) return;
    
    const newStatus = this.task.status === 'completed' ? 'pending' : 'completed';
    const updateData = { status: newStatus };
    
    this.api.updateTask(this.task._id, updateData).subscribe({
      next: (response: any) => {
        if (response.success) {
          this.task = response.data;
          this.showMessage('Task status updated successfully');
          this.cdr.detectChanges();
        }
      },
      error: (error) => {
        console.error('Error toggling task status:', error);
        this.showMessage('Failed to update task status');
      }
    });
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
    if (!dateString) return 'No date';
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  }

  formatDueDate(dateString: string) {
    if (!dateString) return 'No due date';
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
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
}
