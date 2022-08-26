// 電卓に表示される計算式・結果
let preview = "";
// 入力を受け付け OK だった値を詰めた配列
let acceptedVals = [];
// TODO equalState を消したい
let equalState = false;
// 計算履歴
let histories = [];

const updatePreview = (clickedVal) => {
  // switch 文で書いてもいいかも
  // 階層深くなるから嫌かも
  // switch (clickedVal) {
  //   case "AC":
  //   case "CE":
  //     //
  //     break;
  //   case "=":
  //     //
  //     break;
  // }

  // 入力がクリア系の場合
  if (clickedVal === "AC" || clickedVal == "CE") {
    console.log('クリアだよ');
    clearPreview(clickedVal);
    return;
  }

  // 入力が "=" の場合
  if (clickedVal == "=") {
    console.log('イコールだよ');
    equal(clickedVal);
    return;
  }

  // 入力が数字の場合
  if (isNum(clickedVal)) {
    console.log('数字だよ');
  }

  // 入力が "." の場合
  if (clickedVal == ".") {
    console.log('ピリオドだよ');
  }

  // 入力が演算子(加減乗除)の場合
  if (isOperator(clickedVal)) {
    console.log('演算子だよ');
  }

  // 入力が "%" の場合
  if (clickedVal == "%") {
    console.log('パーセントだよ');
  }


  // イコールクリック直後のボタンクリック操作時の処理
  // if (histories.length) {
  //   console.log('あるよ');
  // } else {
  //   console.log('ないよ');
  // }

  if (equalState) {
    if (isNum(clickedVal) || clickedVal == ".") {
      acceptedVals = [];
    } else {
      acceptedVals = [histories[histories.length - 1].answer];
    }
    const lastHis = histories[histories.length - 1];
    document.getElementById("prev-history").textContent = "Ans = " + lastHis.answer;
  }

  appendAcceptedVals(clickedVal);

  // preview の表示を更新
  preview = acceptedVals.join("");
  document.getElementById("preview").value = preview;
  document.getElementById("clear").textContent = "CE";
  equalState = false;
}

// array に push するかの判定 配列が空かつ、特定の演算子が押された場合
// TODO 命名変えたい
const appendAcceptedVals = (val) => {
  const lastEle = acceptedVals[acceptedVals.length - 1];
  if (acceptedVals.length == 0) {
    if (val == "%"
      || val == "÷"
      || val == "×"
      || val == "+"
    ) {
      acceptedVals.push("0");
      appendArray(val);
    } else {
      acceptedVals.push(val);
    }
  } else {
    // 演算子が連続で押された場合、配列に追加せず終了
    if (isOperator(lastEle) && isOperator(val)) {
      // 別の演算子が押された場合、配列の最後を削除し追加
      if (lastEle != val) {
        acceptedVals.pop();
        appendArray(val);
        // - の場合を考慮
      }
    } else if (lastEle === "%" && isNum) {
      acceptedVals.push("×");
      acceptedVals.push(val);
    } else {
      appendArray(val);
    }
  }
}

const appendArray = (val) => {
  if (val == "%"
    || val == "÷"
    || val == "×"
    || val == "−"
    || val == "+"
  ) {
    // 前後にスペース配置
    // TODO 書き方ダサい
    // val = " " + val + " ";
    acceptedVals.push(val);
  } else {
    acceptedVals.push(val)
  }
}

// 数字かどうかを判定する
const isNum = (val) => {
  return !isNaN(val);
}

// イコール押された場合
const equal = (arg) => {
  // イコールが最初に押されるのを防ぐ
  if (acceptedVals.length == 0) {
    return;
  }
  // 最後に入力されたものが演算子の場合、終了
  const val = acceptedVals[acceptedVals.length - 1]
  if (val == "÷"
    || val == "×"
    || val == "−"
    || val == "+"
  ) {
    return;
  }

  // 配列から式を作る
  let expression = "";
  expression = createExpression(acceptedVals);
  expression = expression.replace(/\s+/g, "");
  console.log(expression)
  equalState = true;

  // 計算して、preview に反映する
  document.getElementById("preview").value = calculate(expression);
  document.getElementById("clear").textContent = "AC";

  // 計算履歴の配列に追加
  histories.push({ expression: preview, answer: calculate(expression), acceptedVals });
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
    // TODO space を入れた書き方ダサい
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

const clearPreview = (val) => {
  console.log("go switch");
  switch (val) {
    case "AC":
      allClear(); // 全削除
      break;
    case "CE":
      clearEntry(); // 一文字削除
      break;
    default:
      break;
  }
}

// AC 押された場合、全削除
const allClear = () => {
  acceptedVals = [];
  // 0の初期表示をさせる
  document.getElementById("preview").value = "0";
  document.getElementById("clear").textContent = "CE";
}

// CE 押された場合、一文字削除
const clearEntry = () => {
  if (acceptedVals.length > 0) {
    acceptedVals.pop();
  }
  preview = acceptedVals.join("");
  // 最後の要素の場合、value を0に書き換える
  if (acceptedVals.length == 0) {
    document.getElementById("preview").value = "0";
  } else {
    document.getElementById("preview").value = preview;
  }
}

// 押されたボタンが記号か確認
const isOperator = (val) => {
  let result = false;

  if (val == "÷"
    || val == "×"
    || val == "+"
    || val == "−"
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
    acceptedVals = history.acceptedVals;
  } else {
    const answer = history.answer;
    document.getElementById("preview").value = answer;
    acceptedVals = [answer];
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


