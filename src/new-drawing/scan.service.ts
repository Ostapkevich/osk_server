import { Injectable } from '@nestjs/common';
import * as fs from 'fs';
//import { join } from 'path';
import * as path from 'path';

@Injectable()
export class ScanService {

 /*  scanAllStaticResources(resourcePath: string): string[] {
    const allFolders: string[] = [];
    const scanFolder = (folderPath: string) => {
      const files = fs.readdirSync(folderPath);
      files.forEach((file) => {
        const filePath = path.join(folderPath, file);
        if (fs.statSync(filePath).isDirectory()) {
          allFolders.push(filePath);
          scanFolder(filePath); // Рекурсивный вызов для вложенных папок
        }
      });
    };

    scanFolder(resourcePath); // Начинаем сканирование с основной папки

    return allFolders;
  } */

  scanAllStaticResources(resourcePath: string): string[] {
    const finalFolders: string[] = [];
    const scanFolder = (folderPath: string) => {
      const files = fs.readdirSync(folderPath);
      let isFinalFolder = true; // Флаг для отслеживания конечной папки
      files.forEach((file) => {
        const filePath = path.join(folderPath, file);
        if (fs.statSync(filePath).isDirectory()) {
          isFinalFolder = false; // Если найдена вложенная папка, отмечаем текущую как не конечную
          scanFolder(filePath); // Рекурсивный вызов для вложенных папок
        }
      });
      if (isFinalFolder) {
        finalFolders.push(folderPath); // Если папка оказалась конечной, добавляем ее в список
      }
    };
  
    scanFolder(resourcePath); // Начинаем сканирование с основной папки
  
    return finalFolders;
  }

}
