let preview = "";

let clickedVals = [];

const updatePreview = (clickedVal) => {
  // CE押された場合 1桁削除
  if (clickedVal === 'AC') {
    if (clickedVals.length > 0) {
      clickedVals.pop();
    }
    preview = clickedVals.join('');
    document.getElementById("preview").value = preview;
    return;
  }

  // array に push するかの判定
  // 配列が空かつ、特定の演算子が押された場合
  if (clickedVals.length == 0) {
    console.log("Heloo!!!!!!!!!");
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
  


  // クリックされたボタンの値を array に詰める


  // 演算子?

  // 数字の表示を value で更新
  preview = clickedVals.join('');
  console.log(`preview: ${preview}`);
  document.getElementById("preview").value = preview;

  // 新しい入力がきた場合

  // 
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
const ce = () => {
  if (clickedVals.length > 0) {
    clickedVals.pop();
  }
}

// AC押された場合、全削除
