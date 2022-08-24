let preview = "";
let clickedVals = [];
// TODO equalState を消したい
let equalState = false;
let histories = [];

const updatePreview = (clickedVal) => {
  // clear 処理
  if (clickedVal === "AC" || clickedVal == "CE") {
    clearPreview(clickedVal);
    return;
  }

  // イコールクリック直後のボタンクリック操作時の処理
  if (equalState) {
    if (isNum(clickedVal) || clickedVal == ".") {
      clickedVals = [];
    } else {
      clickedVals = [histories[histories.length - 1].answer];
    }
    const lastHis = histories[histories.length - 1];
    document.getElementById("prev-history").textContent = "Ans = " + lastHis.answer;
  }

  appendClickedVals(clickedVal);

  // pleview の表示を更新
  preview = clickedVals.join("");
  equalState = false;
  document.getElementById("preview").value = preview;
  document.getElementById("clear").textContent = "CE";
}

// array に push するかの判定
// 配列が空かつ、特定の演算子が押された場合
const appendClickedVals = (val) => {
  if (clickedVals.length == 0) {
    if (val == "%"
      || val == "÷"
      || val == "×"
      || val == "+"
    ) {
      clickedVals.push("0");
      clickedVals.push(val);
    } else {
      clickedVals.push(val);
    }
  } else {
    // 演算子が連続で押された場合、配列に追加せず終了
    if (isOperator(clickedVals[clickedVals.length - 1]) && isOperator(val)) {
      // 別の演算子が押された場合、配列の最後を削除し追加
      if (clickedVals[clickedVals.length - 1] != val) {
        clickedVals.pop();
        clickedVals.push(val);
        // - の場合を考慮
      }
    } else {
      clickedVals.push(val);
    }
  }
}

// 数字かどうかを判定する
const isNum = (arg) => {
  return !isNaN(arg);
}

// イコール押された場合
const equal = (arg) => {
  // イコールが最初に押されるのを防ぐ
  if (clickedVals.length == 0) {
    return;
  }
  // 最後に入力されたものが演算子の場合、終了
  const val = clickedVals[clickedVals.length - 1]
  if (val == "÷"
    || val == "×"
    || val == "−"
    || val == "+"
  ) {
    return;
  }

  // 配列から式を作る
  let expression = "";
  expression = createExpression(clickedVals);
  equalState = true;

  // 計算して、preview に反映する
  document.getElementById("preview").value = calculate(expression);
  document.getElementById("clear").textContent = "AC";

  // 計算履歴の配列に追加
  histories.push({ expression: preview, answer: calculate(expression), clickedVals });
  const lastHis = histories[histories.length - 1];
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

const clearPreview = (str) => {
  if (str === "AC") {
    allClear(); // 全削除
  }
  if (str === "CE") {
    clearEntry(); // 一文字削除
  }
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


// 履歴の式と計算結果クリック時の挙動
const historyClick = (e) => {
  equalState = false;
  const element = e.target;
  const historyIndex = element.dataset.historyIndex;
  const historyType = element.dataset.historyType;
  const history = histories[historyIndex];

  if (historyType == "expression") {
    const expression = history.expression;
    document.getElementById("preview").value = expression;
    clickedVals = history.clickedVals;
  } else {
    const answer = history.answer;
    document.getElementById("preview").value = answer;
    clickedVals = [answer];
  }
  closeModal(e);
}

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
    td1.classList.add("td-1");
    td2.classList.add("td-2");
    td3.classList.add("td-1");

    // 履歴クリック用
    td1.dataset.historyIndex = i;
    td2.dataset.historyIndex = i;
    td3.dataset.historyIndex = i;

    td1.dataset.historyType = "expression";
    td2.dataset.historyType = "equal";
    td3.dataset.historyType = "answer";

    td1.innerHTML = histories[i].expression;
    td2.innerHTML = "=";
    td3.innerHTML = histories[i].answer;

    table.appendChild(td1);
    table.appendChild(td2);
    table.appendChild(td3);

    tableEle.appendChild(table);

    td1.addEventListener('click', historyClick);
    td2.addEventListener('click', historyClick);
    td3.addEventListener('click', historyClick);
  }
}


