import * as assert from 'assert';
import { describe, it } from 'mocha';
import { peelingTransaction } from '../../src';

describe('Peeling Transaction', () => {

  it("Invalid PSBT string", () => {
    
    const psbt = "Invalid";
    const response = {
      status: false,
      index: -1,
      error: "Invalid PSBT string"
    }
    const result = peelingTransaction(psbt);
    assert.deepStrictEqual(result, response);
  })

  it("Unprocessed PSBT string without single input and output", () => {
    
    const psbt = "cHNidP8BAFICAAAAAdBFTdfGHrTaikzvaTKAhExJuVcGOREES1pMk+a4GaJAAAAAAAD9////AYAICJIAAAAAFgAUZCdS7uN8HbzN97QP3Z9jsGwxj0YAAAAAAAAA";

    const result = peelingTransaction(psbt);
    const response = {
      status: false,
      index: -1,
    }
    assert.deepStrictEqual(result, response);
  })

  it("PSBT string without single input and output", () => {
    
    const psbt = "cHNidP8BAFICAAAAAdBFTdfGHrTaikzvaTKAhExJuVcGOREES1pMk+a4GaJAAAAAAAD9////AQBlzR0AAAAAFgAUH07rdLvAqWwab5nTbBda6Xg0Q98AAAAAAAEAhQIAAAABAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAD/////BAK9AAD/////AgD5ApUAAAAAFgAUXe1tW5cd6c6fp5s7yQeZvGELmyYAAAAAAAAAACZqJKohqe3i9hw/cdHe/T+pmd+jaVN1XGkGiXmZYrSL69g2l06M+QAAAAABAR8A+QKVAAAAABYAFF3tbVuXHenOn6ebO8kHmbxhC5smAQhrAkcwRAIgZGDkxdepdIYHZEhITaZem41Rc/n99csk9RNxDrRDrKkCIE1MniWw0E5wyuVc1fhb7dkBsfwb2oGgGsNYMY8vgLFMASECEpeD7Cqlzuv2Yt1WI+NhvWXPNVQq+XzDTwk5RDEYs2UAAA==";

    const result = peelingTransaction(psbt);
    const response = {
      status: false,
      index: -1,
    }
    assert.deepStrictEqual(result, response);
  })

  it("Unprocessed PSBT string with peeling outputs", () => {
    
    const psbt = "cHNidP8BAHECAAAAAdBFTdfGHrTaikzvaTKAhExJuVcGOREES1pMk+a4GaJAAAAAAAD9////AoCupY8AAAAAFgAUO9U7CkrMZ060SFyeC2QHoFlNcZWA8PoCAAAAABYAFGQnUu7jfB28zfe0D92fY7BsMY9GAAAAAAAAAAA=";

    const result = peelingTransaction(psbt);
    const response = {
      status: true,
      index: 0
    }
    assert.deepStrictEqual(result, response);
  })
  it("PSBT string with peeling outputs", () => {
    
    const psbt = "cHNidP8BAHECAAAAAdBFTdfGHrTaikzvaTKAhExJuVcGOREES1pMk+a4GaJAAAAAAAD9////AoCupY8AAAAAFgAUO9U7CkrMZ060SFyeC2QHoFlNcZWA8PoCAAAAABYAFGQnUu7jfB28zfe0D92fY7BsMY9GAAAAAAABAIUCAAAAAQAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA/////wQCvQAA/////wIA+QKVAAAAABYAFF3tbVuXHenOn6ebO8kHmbxhC5smAAAAAAAAAAAmaiSqIant4vYcP3HR3v0/qZnfo2lTdVxpBol5mWK0i+vYNpdOjPkAAAAAAQEfAPkClQAAAAAWABRd7W1blx3pzp+nmzvJB5m8YQubJgEIawJHMEQCIAjU4JoVoaa6KMyc+FNkruuLPXdPLhN2/kpFoaiZJ82QAiBEF4YoK14hI3hJ6RXRAMiNot6lOpzYOlof++E7nLad1QEhAhKXg+wqpc7r9mLdViPjYb1lzzVUKvl8w08JOUQxGLNlACICAs4vjhCyxUyhc44olrG+qGuPS00nQ50xguhwK5WoZGT2GP5RKMdUAACAAAAAgAAAAIAAAAAAAgAAgAAiAgPO9ro1bMXYoqlKsMY7nzFhc4zgE5Q4szeOgFLkXrlneRj+USjHVAAAgAAAAIAAAACAAAAAAB0AAIAA";

    const result = peelingTransaction(psbt);
    const response = {
      status: true,
      index: 0
    }
    assert.deepStrictEqual(result, response);
  })
  it("Unprocessed PSBT string without peeling outputs", () => {
    
    const psbt = "cHNidP8BAHECAAAAAdBFTdfGHrTaikzvaTKAhExJuVcGOREES1pMk+a4GaJAAAAAAAD9////AoBgMzwAAAAAFgAUO9U7CkrMZ060SFyeC2QHoFlNcZWAPm1WAAAAABYAFGQnUu7jfB28zfe0D92fY7BsMY9GAAAAAAAAAAA=";

    const result = peelingTransaction(psbt);
    const response = {
      status: false,
      index: -1
    }
    assert.deepStrictEqual(result, response);
  })
  it("PSBT string without peeling outputs", () => {
    
    const psbt = "cHNidP8BAHECAAAAAdBFTdfGHrTaikzvaTKAhExJuVcGOREES1pMk+a4GaJAAAAAAAD9////AoBgMzwAAAAAFgAUO9U7CkrMZ060SFyeC2QHoFlNcZWAPm1WAAAAABYAFGQnUu7jfB28zfe0D92fY7BsMY9GAAAAAAABAIUCAAAAAQAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA/////wQCvQAA/////wIA+QKVAAAAABYAFF3tbVuXHenOn6ebO8kHmbxhC5smAAAAAAAAAAAmaiSqIant4vYcP3HR3v0/qZnfo2lTdVxpBol5mWK0i+vYNpdOjPkAAAAAAQEfAPkClQAAAAAWABRd7W1blx3pzp+nmzvJB5m8YQubJgEIawJHMEQCIGVWpQRKahjnRCyK7ng8KwtOlLVl6Pat8z5Z+4o9OWmfAiA5q+i5EpnpEkqdL4UmpWGRssLwLlMrOMTzCJWf2Q83PgEhAhKXg+wqpc7r9mLdViPjYb1lzzVUKvl8w08JOUQxGLNlACICAs4vjhCyxUyhc44olrG+qGuPS00nQ50xguhwK5WoZGT2GP5RKMdUAACAAAAAgAAAAIAAAAAAAgAAgAAiAgPO9ro1bMXYoqlKsMY7nzFhc4zgE5Q4szeOgFLkXrlneRj+USjHVAAAgAAAAIAAAACAAAAAAB0AAIAA";

    const result = peelingTransaction(psbt);
    const response = {
      status: false,
      index: -1
    }
    assert.deepStrictEqual(result, response);
  })
})