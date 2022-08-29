import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { AppService } from './app.service';
import { takeUntil } from 'rxjs/operators';
import { Subject } from 'rxjs';
import { Inject } from "@angular/core";
import '@datadog/browser-rum/bundle/datadog-rum'

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit, OnDestroy {

  constructor(private appService: AppService) {}

  title = 'angular-dotnet-example';
  

  userForm = new FormGroup({
    firstName: new FormControl('', Validators.nullValidator && Validators.required),
    lastName: new FormControl('', Validators.nullValidator && Validators.required),
    email: new FormControl('', Validators.nullValidator && Validators.required)
  });

  users: any[] = [];
  userCount = 0;

  destroy$: Subject<boolean> = new Subject<boolean>();

  onSubmit() {

    this.appService.addUser(this.userForm.value).pipe(takeUntil(this.destroy$)).subscribe(data => {
      console.log('message::::', data);
      console.log(this.userCount);
      this.userForm.reset();
      this.getAllUsers();
    });
  }

  getAllUsers() {
    this.appService.getUsers().pipe(takeUntil(this.destroy$)).subscribe((users: any[]) => {
        this.userCount = users.length;
        this.users = users;
    });
  }
  
  

  ngOnInit() {
    window.DD_RUM.init({
    applicationId: '75dfec87-f7db-4311-a39d-58fabd5b72f2',
    clientToken: 'pub53dc4340194ac283283d4196d17b9f1b',
    site: 'datadoghq.com',
    sampleRate: 100,
    premiumSampleRate: 100,
    service: "angular-dotnet-example",
    allowedTracingOrigins: ["http://a4fdb2c4b21fa4f61b88d69f2dcbaff5-1823310832.us-east-1.elb.amazonaws.com/"],
});
    
    window.DD_RUM.startSessionReplayRecording();
    this.getAllUsers();

  }

  ngOnDestroy() {
    this.destroy$.next(true);
    this.destroy$.unsubscribe();
  }
}

declare const window: any;
