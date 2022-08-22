let preview = "";
let clickedVals = [];
let equalState = false;


const updatePreview = (clickedVal) => {
  // AC と CE の判定
  if (clickedVal === 'AC' || clickedVal == 'CE') {
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
  preview = clickedVals.join('');
  document.getElementById("preview").value = preview;
  equalState = false;
  document.getElementById("clear").textContent = 'CE';
}

// 数字かどうかを判定する
const isNum = (arg) => {
  return !isNaN(arg);
}

// イコール押された場合
const equal = (fuga) => {
  // 配列から式を作る
  let formula = ""
  formula = createFormula(clickedVals);

  // 計算して、preview に反映する
  document.getElementById("preview").value = calculate(formula);
  equalState = true;
  document.getElementById("clear").textContent = 'AC';
}

// 配列から式を作る
const createFormula = (val) => {
  let formula = "";

  for (let i = 0; i < val.length; i++) {
    if (val[i] == "÷") {
      formula += "/";
    } else if (val[i] == "×") {
      formula += "*";
    } else if (val[i] == "−") {
      formula += "-";
    } else if (val[i] == "%") {
      formula += "/100";
    } else {
      formula += val[i];
    }
  }

  return formula;
}

// 計算を実行する
const calculate = (formula) => {
  // 文字列を関数に変換して返す
  return new Function("return " + formula + ";")();
}

// AC 押された場合、全削除
const allClear = () => {
  clickedVals = [];
  // 0の初期表示をさせる
  document.getElementById("preview").value = '0';
}

// CE 押された場合、一文字削除
const clearEntry = () => {
  if (clickedVals.length > 0) {
    clickedVals.pop();
  }
  preview = clickedVals.join('');
  // 最後の要素の場合、value を0に書き換える
  if (clickedVals.length == 0) {
    document.getElementById("preview").value = '0';
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

// オペランドにピリオドが複数入っていないかチェック

