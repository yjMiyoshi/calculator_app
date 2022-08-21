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

  // 最後にクリックされたボタンの値が数字の場合


  // クリックされたボタンの値を array に詰める
  clickedVals.push(clickedVal);
  console.log(clickedVals);

  // クリックされたのは数字？
  if (isNum(clickedVal)) {

  } else {
    // clickedVals.length[-1]
  }


  console.log(isNum(clickedVal));


  // 演算子?

  // 数字の表示を value で更新
  preview = clickedVals.join('');
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
      // formula += "%";
    }else {
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