function caesarCipher(text: string, shift: number): string {
    let result = '';
    
    for (let i = 0; i < text.length; i++) {
        let char = text[i];

        // Если символ латинский (A-Z или a-z)
        if (/[A-Za-z]/.test(char)) {
            let base = (char === char.toLowerCase()) ? 97 : 65; // для маленьких и больших букв
            let alphabetSize = 26; // Количество букв в латинском алфавите
            let code = text.charCodeAt(i);

            char = String.fromCharCode(((code - base + shift) % alphabetSize + alphabetSize) % alphabetSize + base);
        }
        
        // Если символ кириллический (А-Я или а-я)
        else if (/[А-Яа-я]/.test(char)) {
            let base = (char === char.toLowerCase()) ? 1072 : 1040; // для маленьких и больших букв
            let alphabetSize = 32; // Количество букв в русском алфавите
            let code = text.charCodeAt(i);

            char = String.fromCharCode(((code - base + shift) % alphabetSize + alphabetSize) % alphabetSize + base);
        }

        result += char;
    }

    return result;
}

function caesarDecipher(text: string, shift: number): string {
    return caesarCipher(text, -shift); // Для дешифрования используем сдвиг в обратную сторону
}

function vigenereCipher(text: string, key: string): string {
    let result = '';
    let keyIndex = 0;
    for (let i = 0; i < text.length; i++) {
        let char = text[i];
        if (/[А-Яа-я]/.test(char)) {
            let code = text.charCodeAt(i);
            let base = (char === char.toLowerCase()) ? 1072 : 1040;  // для маленьких и больших букв
            let keyChar = key[keyIndex % key.length];
            let keyCode = keyChar.charCodeAt(0) - base;  // Код буквы ключа
            let alphabetSize = 32; // Количество букв в русском алфавите
            // Сдвигаем символ с учётом ключа
            char = String.fromCharCode(((code - base + keyCode) % alphabetSize + alphabetSize) % alphabetSize + base);
            
            // Переходим к следующему символу в ключе
            keyIndex++;
        }
        result += char;
    }
    return result;
}

function vigenereDecipher(text: string, key: string): string {
    let result = '';
    let keyIndex = 0;
    for (let i = 0; i < text.length; i++) {
        let char = text[i];
        if (/[А-Яа-я]/.test(char)) {
            let code = text.charCodeAt(i);
            let base = (char === char.toLowerCase()) ? 1072 : 1040;  // для маленьких и больших букв
            let keyChar = key[keyIndex % key.length];
            let keyCode = keyChar.charCodeAt(0) - base;  // Код буквы ключа
            let alphabetSize = 32; // Количество букв в русском алфавите
            // Сдвигаем символ в обратную сторону с учётом ключа
            char = String.fromCharCode(((code - base - keyCode) % alphabetSize + alphabetSize) % alphabetSize + base);
            // Переходим к следующему символу в ключе
            keyIndex++;
        }
        result += char;
    }
    return result;
}

function substitutionCipher(text: string, substitutionTable: { [key: string]: string }): string {
    let result = '';
    for (let i = 0; i < text.length; i++) {
        let char = text[i];
        // Если символ есть в таблице замены, заменяем его
        if (substitutionTable[char]) {
            char = substitutionTable[char];
        }
        result += char;
    }
    return result;
}
function substitutionDecipher(text: string, substitutionTable: { [key: string]: string }): string {
    let result = '';
    // Инвертируем таблицу замены для дешифрования
    let inverseTable = Object.fromEntries(Object.entries(substitutionTable).map(([key, value]) => [value, key]));
    for (let i = 0; i < text.length; i++) {
        let char = text[i];
        // Если символ есть в инвертированной таблице замены, заменяем его
        if (inverseTable[char]) {
            char = inverseTable[char];
        }
        result += char;
    }
    return result;
}

function transpositionCipher(text: string, key: number): string {
    let result = '';
    let rows = Math.ceil(text.length / key);

    for (let i = 0; i < key; i++) {
        for (let j = i; j < text.length; j += key) {
            result += text[j];
        }
    }

    return result;
}

function transpositionDecipher(text: string, key: number): string {
    let result = '';
    let rows = Math.ceil(text.length / key);
    let columns = key;
    let remainder = text.length % key;
    let table: string[] = new Array(text.length);

    let idx = 0;
    for (let i = 0; i < columns; i++) {
        let currentLength = rows;
        if (i < remainder) currentLength++;

        for (let j = 0; j < currentLength; j++) {
            table[i * rows + j] = text[idx++];
        }
    }

    for (let i = 0; i < rows; i++) {
        for (let j = 0; j < columns; j++) {
            let idx = j * rows + i;
            if (table[idx]) {
                result += table[idx];
            }
        }
    }

    return result;
}

function blockCipher(text: string, blockSize: number, shift: number): string {
    let result = '';
    
    // Разбиваем текст на блоки
    for (let i = 0; i < text.length; i += blockSize) {
        let block = text.slice(i, i + blockSize);
        result += caesarCipher(block, shift); // Используем шифр Цезаря для каждого блока
    }

    return result;
}

function blockDecipher(text: string, blockSize: number, shift: number): string {
    let result = '';

    for (let i = 0; i < text.length; i += blockSize) {
        let block = text.slice(i, i + blockSize);
        result += caesarDecipher(block, shift); // Используем декодирование шифра Цезаря для каждого блока
    }

    return result;
}

const fs = require('fs');

function fileCipher(filePath: string, outputPath: string, shift: number): void {
    fs.readFile(filePath, 'utf8', (err, data) => {
        if (err) throw err;

        let encryptedData = caesarCipher(data, shift);

        fs.writeFile(outputPath, encryptedData, (err) => {
            if (err) throw err;
            console.log('Файл зашифрован и сохранён.');
        });
    });
}

function fileDecipher(filePath: string, outputPath: string, shift: number): void {
    fs.readFile(filePath, 'utf8', (err, data) => {
        if (err) throw err;

        let decryptedData = caesarDecipher(data, shift);

        fs.writeFile(outputPath, decryptedData, (err) => {
            if (err) throw err;
            console.log('Файл дешифрован и сохранён.');
        });
    });
}

