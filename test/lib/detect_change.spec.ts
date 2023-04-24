import * as assert from 'assert';
import { describe, it } from 'mocha';
import { detectChange } from '../../src';

describe('Detect Change Output', () => {

  it("Invalid PSBT string", () => {
    
    const psbt = "Invalid";
    const response = {
      status: false,
      changeOutputIndices: [],
      error: "Invalid PSBT string"
    }
    const result = detectChange(psbt);
    assert.deepStrictEqual(result, response);
  })

  it("Unprocessed PSBT string without single input and output", () => {
    
    const psbt = "cHNidP8BAFICAAAAAdBFTdfGHrTaikzvaTKAhExJuVcGOREES1pMk+a4GaJAAAAAAAD9////AYAICJIAAAAAFgAUZCdS7uN8HbzN97QP3Z9jsGwxj0YAAAAAAAAA";

    const result = detectChange(psbt);
    const response = {
      status: false,
      changeOutputIndices: [],
    }
    assert.deepStrictEqual(result, response);
  })

  it("PSBT string without single input and output", () => {
    
    const psbt = "cHNidP8BAFICAAAAAdBFTdfGHrTaikzvaTKAhExJuVcGOREES1pMk+a4GaJAAAAAAAD9////AQBlzR0AAAAAFgAUH07rdLvAqWwab5nTbBda6Xg0Q98AAAAAAAEAhQIAAAABAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAD/////BAK9AAD/////AgD5ApUAAAAAFgAUXe1tW5cd6c6fp5s7yQeZvGELmyYAAAAAAAAAACZqJKohqe3i9hw/cdHe/T+pmd+jaVN1XGkGiXmZYrSL69g2l06M+QAAAAABAR8A+QKVAAAAABYAFF3tbVuXHenOn6ebO8kHmbxhC5smAQhrAkcwRAIgZGDkxdepdIYHZEhITaZem41Rc/n99csk9RNxDrRDrKkCIE1MniWw0E5wyuVc1fhb7dkBsfwb2oGgGsNYMY8vgLFMASECEpeD7Cqlzuv2Yt1WI+NhvWXPNVQq+XzDTwk5RDEYs2UAAA==";

    const result = detectChange(psbt);
    const response = {
      status: false,
      changeOutputIndices: [],
    }
    assert.deepStrictEqual(result, response);
  })

  it("PSBT string with different script types", () => {
    
    const psbt = "cHNidP8BAHUCAAAAASaBcTce3/KF6Tet7qSze3gADAVmy7OtZGQXE8pCFxv2AAAAAAD+////AtPf9QUAAAAAGXapFNDFmQPFusKGh2DpD9UhpGZap2UgiKwA4fUFAAAAABepFDVF5uM7gyxHBQ8k0+65PJwDlIvHh7MuEwAAAQD9pQEBAAAAAAECiaPHHqtNIOA3G7ukzGmPopXJRjr6Ljl/hTPMti+VZ+UBAAAAFxYAFL4Y0VKpsBIDna89p95PUzSe7LmF/////4b4qkOnHf8USIk6UwpyN+9rRgi7st0tAXHmOuxqSJC0AQAAABcWABT+Pp7xp0XpdNkCxDVZQ6vLNL1TU/////8CAMLrCwAAAAAZdqkUhc/xCX/Z4Ai7NK9wnGIZeziXikiIrHL++E4sAAAAF6kUM5cluiHv1irHU6m80GfWx6ajnQWHAkcwRAIgJxK+IuAnDzlPVoMR3HyppolwuAJf3TskAinwf4pfOiQCIAGLONfc0xTnNMkna9b7QPZzMlvEuqFEyADS8vAtsnZcASED0uFWdJQbrUqZY3LLh+GFbTZSYG2YVi/jnF6efkE/IQUCSDBFAiEA0SuFLYXc2WHS9fSrZgZU327tzHlMDDPOXMMJ/7X85Y0CIGczio4OFyXBl/saiK9Z9R5E5CVbIBZ8hoQDHAXR8lkqASECI7cr7vCWXRC+B3jv7NYfysb3mk6haTkzgHNEZPhPKrMAAAAAAAAA";

    const result = detectChange(psbt);
    const response = {
      status: true,
      heuristic:"Different output script type",
      changeOutputIndices: [0],
    }
    assert.deepStrictEqual(result, response);
  })

  it("PSBT string with output value that is greater than all inputs", () => {
    
    const psbt = "cHNidP8BAOICAAAAA7Qi7ef0E6AD6g9Bt3wyoscHkmxLEC5h3Ba8cmPSQ/4sAAAAAAD9////IqQqb5nXIPMqqsrPKqqM9EE/eX9gkZKUAy+fYMdXmkYAAAAAAP3////QRU3Xxh602opM72kygIRMSblXBjkRBEtaTJPmuBmiQAAAAAAA/f///wMAZc0dAAAAABYAFPBDHh7uWqcHO721QZpXEuVoTBwOAPIFKgEAAAAWABSV05b1lMkxc+nqd+uPSUILVwYeHYB00hoAAAAAFgAUSYF1d44xnLRVdC6NnlHL02D8CFIAAAAAAAEAcQIAAAABkA1Y8dByKH0mDyKUBe5ueP+y7aexxPG9XrK3MLrCnhAAAAAAAP3///8C8C9oWQAAAAAWABTyU5PRkDq8RbcBO4xPAw3fzm/j1ADKmjsAAAAAFgAU+4gg817/oFQ5lUC4yoYEDY3apNUcAQAAAQEf8C9oWQAAAAAWABTyU5PRkDq8RbcBO4xPAw3fzm/j1AEIawJHMEQCIBWdIWlH77JvRrC5N19jGxWtqnFAG+P8EGSyrEbCxbm6AiAGB2hVmaC6sp+HF8+sGSsgtA7492vAY4i3OJbZ1ud2rwEhAqfnB+Xj+3yW25hzjuemqOvocUU5UvzQcGVH4Ncr5QwzAAEAhQIAAAABAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAD/////BAK/AAD/////AgD5ApUAAAAAFgAUXe1tW5cd6c6fp5s7yQeZvGELmyYAAAAAAAAAACZqJKohqe3i9hw/cdHe/T+pmd+jaVN1XGkGiXmZYrSL69g2l06M+QAAAAABAR8A+QKVAAAAABYAFF3tbVuXHenOn6ebO8kHmbxhC5smAQhrAkcwRAIgQZb6cvmz+zN2XKi0uTiDGA/h54Fwmq7Kgl79+OaHrOcCIGTn1V7atHIbSftBVk0JSjXbIO4lKGViV+/w2o0LbogTASECEpeD7Cqlzuv2Yt1WI+NhvWXPNVQq+XzDTwk5RDEYs2UAAQCFAgAAAAEAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAP////8EAr0AAP////8CAPkClQAAAAAWABRd7W1blx3pzp+nmzvJB5m8YQubJgAAAAAAAAAAJmokqiGp7eL2HD9x0d79P6mZ36NpU3VcaQaJeZlitIvr2DaXToz5AAAAAAEBHwD5ApUAAAAAFgAUXe1tW5cd6c6fp5s7yQeZvGELmyYBCGsCRzBEAiAsbL5J8BmYU7xiXB4ugXwSHHDNBHqHO/yPDLW+iB3IJQIgbHfGNYtsGsZLhOvL7zyLdOvbttbrAhqi/gtKRQG5WhQBIQISl4PsKqXO6/Zi3VYj42G9Zc81VCr5fMNPCTlEMRizZQAiAgMjkEGAFU7t2ZpZU7QYhUnYLLwl2bKoXI3GUHFBrVytkRj+USjHVAAAgAAAAIAAAACAAAAAABgAAIAAIgIDnk5kTZxabqSy0Df2AIBzdMm0NvKzWE0quAqQ9WQyKXMY/lEox1QAAIAAAACAAAAAgAAAAAAZAACAACICA93qRxGbq7sngAu30XKdzWme16stQ7Aa9gWZJmhxP6cMGP5RKMdUAACAAAAAgAAAAIAAAAAAGgAAgAA=";

    const result = detectChange(psbt);
    const response = {
      status: true,
      changeOutputIndices: [2, 0],
      heuristic: 'Output greater than all inputs'
    }
    assert.deepStrictEqual(result, response);
  })

  it("PSBT string with non round output value", () => {
    
    const psbt = "cHNidP8BAP0BAQIAAAADtCLt5/QToAPqD0G3fDKixweSbEsQLmHcFrxyY9JD/iwAAAAAAP3///8ipCpvmdcg8yqqys8qqoz0QT95f2CRkpQDL59gx1eaRgAAAAAA/f///9BFTdfGHrTaikzvaTKAhExJuVcGOREES1pMk+a4GaJAAAAAAAD9////BIA+bVYAAAAAFgAUlF/Upsmtavfz4ZtUXef7y4Sef0IA+QKVAAAAABYAFNb4eJD53mxJ8Ru5hiMCUxXal0g+AJQ1dwAAAAAWABQ71TsKSsxnTrRIXJ4LZAegWU1xlYB00hoAAAAAFgAUDE5OT6fMn7XJePFNLaEaTD4uvHYAAAAAAAEAcQIAAAABkA1Y8dByKH0mDyKUBe5ueP+y7aexxPG9XrK3MLrCnhAAAAAAAP3///8C8C9oWQAAAAAWABTyU5PRkDq8RbcBO4xPAw3fzm/j1ADKmjsAAAAAFgAU+4gg817/oFQ5lUC4yoYEDY3apNUcAQAAAQEf8C9oWQAAAAAWABTyU5PRkDq8RbcBO4xPAw3fzm/j1AEIawJHMEQCIH/eWaATaO0+SZxCDJEl48t5UaUeQzCK2N89qiYq4SqmAiAI2yk1AToli7ZW6YH9d1appR8v6V3QV85zdRPliGDUTwEhAqfnB+Xj+3yW25hzjuemqOvocUU5UvzQcGVH4Ncr5QwzAAEAhQIAAAABAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAD/////BAK/AAD/////AgD5ApUAAAAAFgAUXe1tW5cd6c6fp5s7yQeZvGELmyYAAAAAAAAAACZqJKohqe3i9hw/cdHe/T+pmd+jaVN1XGkGiXmZYrSL69g2l06M+QAAAAABAR8A+QKVAAAAABYAFF3tbVuXHenOn6ebO8kHmbxhC5smAQhrAkcwRAIgLQXLkzepwGFI8ScmPrmjHeYZtGfXamu8xLFvHHVjHQICICV/LqYVH/Dj/WU4rPcNlRAUHKLZCa0NcEKzGz1SSuQ4ASECEpeD7Cqlzuv2Yt1WI+NhvWXPNVQq+XzDTwk5RDEYs2UAAQCFAgAAAAEAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAP////8EAr0AAP////8CAPkClQAAAAAWABRd7W1blx3pzp+nmzvJB5m8YQubJgAAAAAAAAAAJmokqiGp7eL2HD9x0d79P6mZ36NpU3VcaQaJeZlitIvr2DaXToz5AAAAAAEBHwD5ApUAAAAAFgAUXe1tW5cd6c6fp5s7yQeZvGELmyYBCGsCRzBEAiANydthAH4aNaWAY4Dr+M3dMu3u+fo3avIu1gv15iW+wgIgCB9D6VVQuBzu+ydG2vgEvDrGoUhZimBPyJZOyexGTG4BIQISl4PsKqXO6/Zi3VYj42G9Zc81VCr5fMNPCTlEMRizZQAiAgNKIArur4qKSOY2WIpYiH/Q1T+Ar8IB8M1RAx/gPMP30Bj+USjHVAAAgAAAAIAAAACAAAAAAAQAAIAAIgIDXtZ9PU6A3RQHiR7Huqrauxupnv+Ywr1/lM07pHTYSd0Y/lEox1QAAIAAAACAAAAAgAAAAAABAACAACICAs4vjhCyxUyhc44olrG+qGuPS00nQ50xguhwK5WoZGT2GP5RKMdUAACAAAAAgAAAAIAAAAAAAgAAgAAiAgOw9VZl12mlDByPmst9r+rQs7/yg5if9S28s7pdxK7Schj+USjHVAAAgAAAAIAAAACAAAAAAAUAAIAA";

    const result = detectChange(psbt);
    const response = {
      status: true,
      heuristic: 'Non-round number outputs',
      changeOutputIndices: [0, 3]
    }
    assert.deepStrictEqual(result, response);
  })

  it("Unprocessed PSBT string with peeling outputs", () => {
    
    const psbt = "cHNidP8BAHECAAAAAdBFTdfGHrTaikzvaTKAhExJuVcGOREES1pMk+a4GaJAAAAAAAD9////AoCupY8AAAAAFgAUO9U7CkrMZ060SFyeC2QHoFlNcZWA8PoCAAAAABYAFGQnUu7jfB28zfe0D92fY7BsMY9GAAAAAAAAAAA=";

    const result = detectChange(psbt);
    const response = {
      status: true,
      heuristic: 'Largest output',
      changeOutputIndices: [ 0 ]
    }
    assert.deepStrictEqual(result, response);
  })

  it("PSBT string with peeling outputs", () => {
    
    const psbt = "cHNidP8BAHECAAAAAdBFTdfGHrTaikzvaTKAhExJuVcGOREES1pMk+a4GaJAAAAAAAD9////AoCupY8AAAAAFgAUO9U7CkrMZ060SFyeC2QHoFlNcZWA8PoCAAAAABYAFGQnUu7jfB28zfe0D92fY7BsMY9GAAAAAAABAIUCAAAAAQAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA/////wQCvQAA/////wIA+QKVAAAAABYAFF3tbVuXHenOn6ebO8kHmbxhC5smAAAAAAAAAAAmaiSqIant4vYcP3HR3v0/qZnfo2lTdVxpBol5mWK0i+vYNpdOjPkAAAAAAQEfAPkClQAAAAAWABRd7W1blx3pzp+nmzvJB5m8YQubJgEIawJHMEQCIAjU4JoVoaa6KMyc+FNkruuLPXdPLhN2/kpFoaiZJ82QAiBEF4YoK14hI3hJ6RXRAMiNot6lOpzYOlof++E7nLad1QEhAhKXg+wqpc7r9mLdViPjYb1lzzVUKvl8w08JOUQxGLNlACICAs4vjhCyxUyhc44olrG+qGuPS00nQ50xguhwK5WoZGT2GP5RKMdUAACAAAAAgAAAAIAAAAAAAgAAgAAiAgPO9ro1bMXYoqlKsMY7nzFhc4zgE5Q4szeOgFLkXrlneRj+USjHVAAAgAAAAIAAAACAAAAAAB0AAIAA";

    const result = detectChange(psbt);
    const response = {
      status: true,
      heuristic: 'Largest output',
      changeOutputIndices: [ 0 ]
    }
    assert.deepStrictEqual(result, response);
  })
  
})