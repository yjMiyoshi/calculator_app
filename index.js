let preview = "";
let clickedVals = [];
let equalState = false;
let histories = [];

const updatePreview = (clickedVal) => {
  // AC と CE の判定
  if (clickedVal === "AC" || clickedVal == "CE") {
    if (equalState) {
      allClear(); // 全削除
    } else {
      clearEntry(); // 一文字削除
    }
    return;
  }

  // 演算子が連続で押された場合、配列に追加せず終了
  if (
    isOperator(clickedVals[clickedVals.length - 1]) &&
    isOperator(clickedVal)
  ) {
    return;
  }

  // イコールクリック直後のボタンクリック操作時の処理
  if (equalState) {
    clickedVals = [];
    let lastHis = histories[histories.length - 1];
    document.getElementById("prev-history").textContent = "Ans = " +lastHis.answer;
  }

  // array に push するかの判定
  // 配列が空かつ、特定の演算子が押された場合
  if (clickedVals.length == 0) {
    if (clickedVal == "%"
      || clickedVal == "÷"
      || clickedVal == "×"
      || clickedVal == "+"
    ) {
      clickedVals.push("0");
      clickedVals.push(clickedVal);
    } else {
      clickedVals.push(clickedVal);
    }
  } else {
    clickedVals.push(clickedVal);
  }

  // pleview の表示を更新
  preview = clickedVals.join("");
  equalState = false;
  document.getElementById("preview").value = preview;
  document.getElementById("clear").textContent = "CE";
}

// 数字かどうかを判定する
const isNum = (arg) => {
  return !isNaN(arg);
}

// イコール押された場合
const equal = (arg) => {
  // 配列から式を作る
  let expression = ""
  expression = createExpression(clickedVals);

  equalState = true;
  // 計算して、preview に反映する
  document.getElementById("preview").value = calculate(expression);
  document.getElementById("clear").textContent = "AC";

  // 計算履歴の配列に追加
  histories.push({ expression: preview, answer: calculate(expression) });
  let lastHis = histories[histories.length - 1];
  document.getElementById("prev-history").textContent = lastHis.expression + " = ";
  createHistoryTable();
  // モーダル初期表示消す
  if (histories.length != 0) {
    document.getElementById("modal-text").style.display = "none";
    document.getElementById("history-table").style.display = "block";
  }
}

// 配列から式を作る
const createExpression = (val) => {
  let expression = "";

  for (let i = 0; i < val.length; i++) {
    if (val[i] == "÷") {
      expression += "/";
    } else if (val[i] == "×") {
      expression += "*";
    } else if (val[i] == "−") {
      expression += "-";
    } else if (val[i] == "%") {
      expression += "/100";
    } else {
      expression += val[i];
    }
  }

  return expression;
}

// 計算を実行する
const calculate = (expression) => {
  // 文字列を関数に変換して返す
  return new Function("return " + expression + ";")();
}

// AC 押された場合、全削除
const allClear = () => {
  clickedVals = [];
  // 0の初期表示をさせる
  document.getElementById("preview").value = "0";
  document.getElementById("clear").textContent = "CE";
}

// CE 押された場合、一文字削除
const clearEntry = () => {
  if (clickedVals.length > 0) {
    clickedVals.pop();
  }
  preview = clickedVals.join("");
  // 最後の要素の場合、value を0に書き換える
  if (clickedVals.length == 0) {
    document.getElementById("preview").value = "0";
  } else {
    document.getElementById("preview").value = preview;
  }
}

// 押されたボタンが記号か確認
const isOperator = (operator) => {
  let result = false;

  if (operator == "÷"
    || operator == "×"
    || operator == "+"
    || operator == "−"
  ) {
    result = true;
  }

  return result;
}

// 履歴アイコンクリックでモーダル表示
const openModal = (e) => {
  document.getElementById("modal").style.display = "block";
  // 処理伝播を止める
  e.stopPropagation();
}

// 履歴アイコンクリックでモーダル非表示
const closeModal = (e) => {
  document.getElementById("modal").style.display = "none";
  e.stopPropagation();
}

// モーダル外クリックでモーダル非表示
let modal = document.getElementById("modal");

const outsideClose = (e) => {
  if (e.target != document.getElementById("modal")) {
    modal.style.display = "none";
  }
}
addEventListener("click", outsideClose);

// TODO オペランドにピリオドが複数入っていないかチェック

// 配列からテーブルを作成する
const createHistoryTable = () => {

  // 初期化
  document.getElementById("history-table").innerHTML = "";
  let tableEle = document.getElementById("history-table");

  for (let i = 0; i < histories.length; i++) {
    let table = document.createElement("table");
    table.classList.add("table-1");

    const td1 = document.createElement("td");
    const td2 = document.createElement("td");
    const td3 = document.createElement("td");
    // class 付与
    td1.classList.add("his-1");
    td2.classList.add("his-2");
    td3.classList.add("his-1");

    td1.innerHTML = histories[i].expression;
    td2.innerHTML = "=";
    td3.innerHTML = histories[i].answer;

    table.appendChild(td1);
    table.appendChild(td2);
    table.appendChild(td3);

    tableEle.appendChild(table);
  }
}
