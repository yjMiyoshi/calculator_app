let preview = "";
let clickedVals = [];
let equalState = false;


const updatePreview = (clickedVal) => {
  // ac と ce の判定
  if (clickedVal === 'AC') {
    console.log(1);
    if (equalState) {
      console.log(2);
      // 全削除
      ac();
    } else {
      console.log(3);
      // 一文字削除
      ce(clickedVals);
    }
    return;
  }

  // 演算子が連続で押された場合、配列に追加せず終了
  if (isOperator(clickedVals[clickedVals.length - 1]) && isOperator(clickedVal)) {
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
  console.log(`preview: ${preview}`);
  document.getElementById("preview").value = preview;
  equalState = false;
}

// 数字かどうかを判定する
const isNum = (arg) => {
  return !isNaN(arg);
}

// イコール押された場合
const equal = (fuga) => {
  // 区切りを作成した配列を作成する（mapか?）
  // TODO 2桁 3桁 演算子等


  // 配列から式を作る
  let formula = ""
  formula = createFormula(clickedVals);
  console.log(`formula: ${formula}`);

  // 計算して、preview に反映する
  document.getElementById("preview").value = calculate(formula);
  equalState = true;
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

// CE押された場合 1桁削除
const ce = (array) => {
  if (array.length > 0) {
    array.pop();
  }
  preview = array.join('');
  document.getElementById("preview").value = preview;
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

// AC押された場合、全削除
const ac = () => {
  clickedVals = [];
  // 
  document.getElementById("preview").value = '0';
}

