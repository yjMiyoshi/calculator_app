// 電卓に表示される計算式・結果
let preview = "";
// 入力を受け付け OK だった値を詰めた配列
let acceptedVals = [];
// イコールを押した直後か判定
let equalState = false;
// 計算履歴
let histories = [];

const updatePreview = (clickedVal) => {
  // 最後に入力したもの
  const lastElement = acceptedVals[acceptedVals.length - 1];

  // イコールクリック直後のボタンクリック操作時の処理
  if (equalState) {
    if (isNum(clickedVal) || clickedVal == ".") {
      acceptedVals = [];
    } else {
      acceptedVals = [histories[histories.length - 1].answer];
    }
    const lastHistory = histories[histories.length - 1];
    document.getElementById("prev-history").textContent = "Ans = " + lastHistory.answer;
  }

  // 入力がクリア系の場合
  if (clickedVal === "AC" || clickedVal == "CE") {
    console.log('クリアだよ');
    clearPreview(clickedVal);
    return;
  }

  // 入力が "=" の場合
  if (clickedVal == "=") {
    console.log('イコールだよ');
    equal();
    return;
  }

  // 入力が数字の場合
  if (isNum(clickedVal)) {
    console.log('数字だよ');
    if (lastElement == "%") {
      acceptedVals.push("×");
    }
    acceptedVals.push(clickedVal);
  }

  // 入力が "." の場合
  if (clickedVal == ".") {
    console.log('ピリオドだよ');
    // ピリオドが複数個ないか確認
    if (existsPeriod()) return;
    acceptedVals.push(clickedVal);
  }

  // 入力が演算子(加減乗除)の場合
  if (isOperator(clickedVal)) {
    console.log('演算子だよ');
    // 連続で同じ演算子は受け付けない
    if (lastElement == clickedVal) {
      return;
    }

    // 一文字目の入力の場合
    if (acceptedVals.length == 0) {
      if (clickedVal != "−") {
        acceptedVals.push("0");
      }
      acceptedVals.push(clickedVal);
    } else {
      if (isOperator(lastElement)) {
        acceptedVals.pop();
      }
    }
    acceptedVals.push(clickedVal);
  }

  // 入力が "%" の場合
  if (clickedVal == "%") {
    console.log('パーセントだよ');
    // 一文字目の入力の場合
    if (acceptedVals.length == 0) {
      acceptedVals.push("0");
    } else {
      if (isOperator(lastElement)) {
        acceptedVals.pop();
      }
    }
    acceptedVals.push(clickedVal);
  }

  // preview の表示を更新
  preview = acceptedVals.join("");
  document.getElementById("preview").value = preview;
  document.getElementById("clear").textContent = "CE";
  equalState = false;
}

// 数字かどうかを判定する
const isNum = (val) => {
  return !isNaN(val);
}



// イコール押された場合
const equal = () => {
  // イコールが最初に押されるのを防ぐ
  if (acceptedVals.length == 0) {
    return;
  }

  // 最後に入力されたものが演算子の場合、終了
  const lastVal = acceptedVals[acceptedVals.length - 1]
  if (isOperator(lastVal)) {
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
  const lastHistory = histories[histories.length - 1];
  document.getElementById("prev-history").textContent = lastHistory.expression + " = ";
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
  // 計算式を関数に変換して返す
  return new Function("return " + expression + ";")();
}

const clearPreview = (val) => {
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
  // 初期値0を表示させる
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
    || val == "−"
    || val == "+"
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

// 直前の履歴の更新
const updateLastHistory = () => {

}


// 演算子の前にスペースをつける
const addSpaceFront = () => {

}

// 演算子の後ろにスペースをつける
const addSpaceBehind = () => {

}

// 演算子の前後にスペースをつける
const addSpaceToOperator = () => {

}

// 乗除の演算子のあとにマイナスがきた場合、入力をうけつける


// acceptedVals の最後の要素の末尾スペース削除し、preview に反映
// 関数にしなくてよいかも
const trimEndSpace = () => {
  acceptedVals[acceptedVals.length - 1].trimEnd();
}

// 演算子を区切りで分割し、文字列内にピリオドが入っているか判定する
const existsPeriod = () => {
  const array = acceptedVals;
  const str = array.join("");
  const trimmedStr = str.replace(/ /g, ""); // 空白の除去

  // ÷×−+ のいずれかが合致した最後のインデックスを探す
  const opeArray = ["÷", "×", "−", "+"];
  const opeIndexArray = [];
  for (let i = 0; i < opeArray.length; i++) {
    opeIndexArray.push(trimmedStr.indexOf(opeArray[i]));
  }

  // 最後の ÷×−+ 以降にピリオドが入っているか確認
  const afterLastOperator = trimmedStr.substring(Math.max(...opeIndexArray) + 1);
  const boolean = afterLastOperator.match(/\./)
  return boolean;
}