import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FileInfo, Filesystem, ReaddirResult } from '@capacitor/filesystem';
import { IonicModule, RefresherCustomEvent } from '@ionic/angular';

@Component({
	selector: 'app-home',
	templateUrl: 'home.page.html',
	styleUrls: ['home.page.scss'],
	standalone: true,
	imports: [IonicModule, CommonModule],
})
export class HomePage {
	folders: string[] = [];
	currentPath:string = "/sdcard/"; // upmost readable path
	constructor(){
		// Upon start, show current directory listing
		Filesystem.readdir({
			path: this.currentPath
		}).then((res:ReaddirResult)=>{
			this.folders = [];
			this.folders.push(...res.files.map((entry:FileInfo)=>{
				return entry.name;
			}));
		});
	}

	/**
	 * Refresh current view
	 * @param ev The refresher event
	 */
	refresh(ev: any) {
		Filesystem.readdir({
			path: this.currentPath
		}).then((res:ReaddirResult)=>{
			this.folders = [];
			this.folders.push(...res.files.map((entry:FileInfo)=>{
				return entry.name;
			}));
			(ev as RefresherCustomEvent).detail.complete();
		});
	}

	Scan(folder:string){
		if(folder === ".."){
			this.currentPath = this.currentPath.replace(/\/.*\/$/, "/");
			folder = "";
		}
		if(this.currentPath === "/") this.currentPath = "/sdcard/";
		Filesystem.readdir({
			path: this.currentPath + folder
		}).then((res:ReaddirResult)=>{
			// You'd expect the result "res" to contain both directories and files, but it keeps being directories only
			this.folders = [".."];
			this.folders.push(...res.files.map((entry:FileInfo)=>{
				return entry.name;
			}));
		});
	}
}
