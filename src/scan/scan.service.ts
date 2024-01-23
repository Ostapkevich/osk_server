import { Injectable } from '@nestjs/common';
import * as fs from 'fs';
//import { join } from 'path';
import * as path from 'path';

@Injectable()
export class ScanService {
  
    scanAllStaticResources(resourcePath: string): string[] {
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
      }
}
