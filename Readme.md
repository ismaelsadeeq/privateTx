# **Private Tx**

Javascript chain analysis library for node.js and browsers written in TypeScript, designed to help developers, researchers, and analysis tools to examine the inputs and outputs of Bitcoin transactions and identify potential privacy leaks.


Given a transaction it provides heuristics information on:
  -  **Address Reuse:** identifies instances where input addresses are being reused as outputs addresses.
  -  **Common Inputs:** detect if inputs in a transaction are likely to come from the same wallet.
  -  **Change Outputs Detection:** provides indices of all change outputs in a transaction.
  -  **Peeled Transaction:** determine if a transaction is **peeled** and provide the payment output index and the change output index.

## Usage
The library is built to improve privacy for Bitcoin users by providing a tool for identifying potential privacy leaks. It can be used by developers building more privacy-preserving applications or by researchers analyzing the privacy properties of the Bitcoin network. With its comprehensive analysis capabilities, PrivateTx offers a valuable tool for anyone looking to better understand the privacy implications of Bitcoin transactions

To ensure privacy and avoid detection by chain analysis tools, it is essential to test constructed transactions against the most common heuristics used by these tools to cluster transactions and determine wallet balances. Running the constructed transaction against these heuristics, one at a time, and verifying that it passes without analysis is crucial to ensure the wallet's resistance to chain analysis. This process helps to ensure the privacy of the transaction and the security of the wallet.

### Installation Guide

```bash
$ npm install privatetx-lib
```

## **Examples**

### Transaction input format
**Processed Base 64 PSBT**

***1. Address Reuse***

```
import { checkAddressReuse } from "privatetx-lib";

const transactionPsbt = "cHNidP8BAHUCAAAAASaBcTce3/KF6Tet7qSze3gADA.....";

const reusedAddresses = checkAddressReuse(transactionPsbt);

console.log(reusedAddresses);
// { status: true, data: [ { vin:0, vout: 1} ] }
```
This example demonstrates address reuse in a transaction, where the address of the first input is reused as the second output address.

The output of this function includes:

  -  The status Boolean, where `true` indicates the presence of address reuse and `false` indicates the absence of address reuse.
  -  An array of objects contained in `data`, representing instances of address reuse. Each object in the array contains the input index `vin` and output index `vout` where the address was reused.

***2. Common Inputs***

```
import { commonInputs } from "privatetx-lib";

const transactionPsbt = "cHNidP8BAO4CAAAAA7.....";

const inputsCommon = commonInputs(transactionPsbt);

console.log(inputsCommon);
// true
```
In the above example, the `commonInputs` function is used to check if the inputs of a given transaction are common and likely to come from the same wallet. If the inputs are common, the output will be `true`, and if they are not, the output will be `false`.


***3. Detect Change Outputs***
```
import { detectChange } from "privatetx-lib";

const transactionPsbt = "cHNidP8BAO4CAAAAA7.....";

const changeOutputs = detectChange(transactionPsbt);

console.log(changeOutputs);
// { status: true, changeOutputIndices: [ 0 ], heuristic: 'Different output script type' }
```
The output of the function is an object with three properties:

  status: a boolean that indicates whether change outputs were detected (true) or not (false).
  changeOutputIndices: an array of integers representing the indices of the detected change outputs.
  heuristic: a string that provides information on the heuristic used to detect the change outputs. In this example, the heuristic used is "Different output script type".
  The heuristics used by this functions are **Address reuse**, **Different output script type** , **Output greater than all inputs**, **Non-round number outputs** , **Largest output**
 
In this particular example, the output indicates that change outputs were detected (status: true) and that the only detected change output is at index 0 (changeOutputIndices: [ 0 ]). The heuristic used to detect the change outputs was "Different output script type".

***3. Peeling Transaction***
```
import { peelingTransaction } from "privatetx-lib";

const transactionPsbt = "cHNidP8BAO4CAAAAA7Qi7ef.....";

const transactionIsPeeled = peelingTransaction(transactionPsbt);

console.log(transactionIsPeeled);
// { status: true, index: 2 }
```

The output of this function is an object with a status property that is `true` if the transaction  specified in `transactionPsbt` is peeled, and `false` otherwise. Additionally, if the transaction is peeled, the object will contain an index property that indicates the index of the change output, where as all other outputs in the transaction are payments.

The example output is an object with a status property that is `true`, which means the transaction is peeled, and the change output index that is 2 (which means the the third output).


### Tests
```bash
$ npm run test
```
[Test folder](https://github.com/ismaelsadeeq/privateTx/tree/main/test)



-----

This project is built during [Qala](https://qala.dev) bitcoin development training cohort, a program training African software engineers transitioning to bitcoin and open source software development.
 

### **Stay in touch**

Twitter 
- [Abubakar Sadiq Ismail](https://twitter.com/sadeeq_ismaela)
- [Qala](https://twitter.com/QalaAfrica)

### **License**
 [MIT licensed](LICENSE).

Feel free to create a PR for an improvement or open an issue if you encounter one.

    Dont Trust, Verify!!!

Happy Hacking ❤️ 