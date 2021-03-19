import { Component, OnInit } from '@angular/core';
import { StudentService } from '../service/student.service';
import { Student, IStudent } from '../model/student';
import { Pipe, PipeTransform } from '@angular/core';
import tableDragger from 'table-dragger'

// import {CdkDragDrop, moveItemInArray, transferArrayItem} from '@angular/cdk/drag-drop';
import {CdkDragDrop, moveItemInArray, transferArrayItem, CdkDragHandle} from '@angular/cdk/drag-drop';

@Component({

  selector: 'app-student',

  templateUrl: './student.component.html',

  styleUrls: ['./student.component.css'],

  providers: [StudentService]

})
export class StudentComponent implements OnInit {


  private service: StudentService;
  students: Array<IStudent> = [];
  newStudent: IStudent = new Student();
  oldStudent: IStudent = new Student();

  editing = false;
  table: any;
 searchText:any
  constructor(service: StudentService) {
    this.service = service;
  }


  ngOnInit() {
    this.getStudents();
    var id = document.getElementById('table');
    console.log(id)
    var dragger = tableDragger(id, {
    mode: 'column',
    onlyBody: true,
    animation: 300
  });
  dragger.on('drop',function(from, to){
  });
  }
  async getStudents() {
    try {
      this.students = await this.service.getStudents();
    } catch (error) {
      console.error(error);
      alert(error.message);
    }
  }

  add(e:any){
    this.newStudent.firstname = e.target.value
    console.log(e.target.name, e.target.value);
  }

  async addStudent() {
    try {
      const addedStudents = await this.service.addStudent(this.newStudent) as IStudent[];
      if (addedStudents.length > 0) {
        this.students.push(addedStudents[0]);
        this.clearNewStudent();
        // alert('Successfully added');
      }
    } catch (error) {
      alert(error.message);
    }
  }

  clearNewStudent() {
    this.newStudent = new Student();
  }

  async deleteStudent(studentId) {
    try {
      const noOfrowsDeleted = await this.service.deleteStudent(studentId);
      if (noOfrowsDeleted > 0) {
        const index = this.students.findIndex(student => student.id === studentId);
        this.students.splice(index, 1);
        alert('Successfully deleted');
      }
    } catch (error) {
      console.error(error);
      alert(error.message);
    }

  }

  clearOldStudent() {
    this.oldStudent = new Student();
  }

  async getStudent(studentId) {
    try {
      const students = await this.service.getStudentById(studentId);
      if (students.length > 0) {
        this.oldStudent = students[0];
      }
    } catch (error) {
      console.error(error);
      alert(error.message);
   }

  }
  async updateStudent() {
    const updatedValue: IStudent = {
      firstname: this.oldStudent.firstname,
    email: this.oldStudent.email,
    lastname: this.oldStudent.lastname
    };
    try {
      const noOfrowsUpdated = await this.service.updateStudent(this.oldStudent.id, updatedValue);
      if (noOfrowsUpdated > 0) {
        const index = this.students.findIndex(student => student.id === this.oldStudent.id);
        this.students[index] = this.oldStudent;
        this.clearOldStudent();
        alert('Successfully updated');
      }
    } catch (error) {
      console.error(error);
      alert(error.message);
    }
  }

  async clearAllStudents() {
    try {
      await this.service.clearStudents();
      this.students = [];
      alert('All students cleared');
    } catch (error) {
      alert(error.message);
    }

  }
  drop(event: CdkDragDrop<string[]>) {
    if (event.previousContainer === event.container) {
      moveItemInArray(event.container.data, event.previousIndex, event.currentIndex);
    } else {
      transferArrayItem(event.previousContainer.data,
                        event.container.data,
                        event.previousIndex,
                        event.currentIndex);
    }
  }

  dropTable(event: CdkDragDrop<IStudent[]>) {
    const prevIndex = this.students.findIndex((d) => d === event.item.data);
    moveItemInArray(this.students, prevIndex, event.currentIndex);
    this.table.renderRows();
  }

}




