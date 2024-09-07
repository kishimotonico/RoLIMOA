# RoLIMOAのPython拡張

RoLIMOAに拡張機能を追加するPythonの簡単なライブラリとサンプルコードです。
Node.jsの**サーバー本体のソースコードを変更することなく**、Pythonで機能追加することができます。

## 想定ユースケース

- RoLIMOAで試合結果を確定したとき、Googleスプレッドシートを編集する
- RoLIMOAのタスク状況と連携して、フィールド上のLEDを点灯する
- 外部システムによる自動審判の結果を、RoLIMOAに入力して配信画面や点数に反映する

## 使い方

基本的な使い方はrolimoa_extension.pyの `if __name__ == "__main__":` 以降のコード例を参考にしてください。

## サンプルコード

使用例にある一部の使い方は ./example 以下に実装例があります。
詳細は、各サンプルのREADME.mdを参照ください。

サンプルでは "ImportError: attempted relative import with no known parent package" の都合で、インポートが次のようになっています。

```Python
from pathlib import Path
import sys
sys.path.append(str(Path(__file__).parent.parent.parent))
from rolimoa_extension import RoLIMOAExtension
```
