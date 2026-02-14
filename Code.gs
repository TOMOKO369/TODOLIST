function doGet() {
  return HtmlService.createTemplateFromFile('index').evaluate()
      .setTitle('自画自賛！褒め褒めアプリ')
      .addMetaTag('viewport', 'width=device-width, initial-scale=1');
}

/**
 * データをスプレッドシートに保存する
 * @param {string} content - やったことの内容
 * @param {string} praise - 褒め言葉
 */
function saveData(content, praise) {
  try {
    // 指定されたIDのスプレッドシートを開く
    const ss = SpreadsheetApp.openById('1wmbUPZaIEFk2K_g53tooeZNXdWw7eoQeQJs4JAtBI80');
    const sheet = ss.getSheets()[0]; // 1枚目のシートを使用
    
    // 日付のフォーマット (yyyy/MM/dd)
    const date = new Date();
    const formattedDate = Utilities.formatDate(date, Session.getScriptTimeZone(), "yyyy/MM/dd");
    
    // 最終行に追加: [日付, 内容, 褒め言葉]
    sheet.appendRow([formattedDate, content, praise]);
    return { success: true };
  } catch (e) {
    return { success: false, error: e.toString() };
  }
}

/**
 * 3日前の記録を取得する
 */
function getThreeDaysAgoData() {
  try {
    const ss = SpreadsheetApp.openById('1wmbUPZaIEFk2K_g53tooeZNXdWw7eoQeQJs4JAtBI80');
    const sheet = ss.getSheets()[0];
    const data = sheet.getDataRange().getValues();
    
    if (data.length === 0) return [];
    
    // 3日前の日付を計算
    const today = new Date();
    const threeDaysAgo = new Date(today);
    threeDaysAgo.setDate(today.getDate() - 3);
    const targetDateStr = Utilities.formatDate(threeDaysAgo, Session.getScriptTimeZone(), "yyyy/MM/dd");
    
    const results = [];
    
    // データを走査して3日前のものを探す
    for (let i = 0; i < data.length; i++) {
      const row = data[i];
      const rowDate = row[0]; // A列: 日付
      const content = row[1]; // B列: 内容
      
      let rowDateStr = "";
      
      // 日付がDateオブジェクトの場合
      if (rowDate instanceof Date) {
        rowDateStr = Utilities.formatDate(rowDate, Session.getScriptTimeZone(), "yyyy/MM/dd");
      } 
      // 日付が文字列の場合
      else if (typeof rowDate === 'string') {
        // "yyyy/MM/dd" 形式が含まれているかチェック、またはそのまま比較
        rowDateStr = rowDate.substr(0, 10); 
      }
      
      if (rowDateStr === targetDateStr) {
        results.push(content);
      }
    }
    
    return results;
  } catch (e) {
    Logger.log(e);
    return [];
  }
}
