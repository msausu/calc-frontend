
import React, { useState } from "react";
import LogoutIcon from '@mui/icons-material/Logout';

import "./CalculatorComponent.css";

import CalculatorHelpComponent from './CalculatorHelpComponent';
import BalanceService from "./BalanceComponent";
import RecordLog from '../Record/RecordReportComponent';
import useRemoteCalculatorService from './OperationService';
import { useModal } from '../Record/ReportController';


interface LogoutProps {
  onLogout: () => void;
}

const Calculator: React.FC<LogoutProps> = ({onLogout}) => {

  const [result, setResult] = useState<string>("");
  const [balance, setBalance] = useState<number>(0);
  const [dot, setDot] = useState<boolean>(false);
  const [help, setHelp] = useState<boolean>(false);
  const [operation, setOperation] = useState<string>("");
  const getResult = () => result;
  const { doOperationRemote, doRandomRemote } = useRemoteCalculatorService({ getResult, setBalance, setResult });
  const { dispatch } = useModal();


  const getElementByIdAsync = (id: string) => new Promise(resolve => {
    const getElement = () => {
      const element = document.getElementById(id);
      if (element) {
        resolve(element);
      } else {
        requestAnimationFrame(getElement);
      }
    };
    getElement();
  });

  const isElementPresent = async (id: string) => {
    await getElementByIdAsync(id);
  }

  const handleLog = () => {
    const id = 'modal-init-button';
    dispatch({ type: 'OPEN_REPORT' });
    isElementPresent(id).then(() => {
      document.getElementById(id)?.click();
    })
  };

  const debounce = <T extends (...args: unknown[]) => unknown>(callback: T) => {
    let timer: ReturnType<typeof setTimeout>;
    return (...args: Parameters<T>) => {
      clearTimeout(timer);
      timer = setTimeout(() => {
        callback.apply(this, args);
      }, 300);
    };
  };

  const handleKey = (key: string) => {
    return (event: React.KeyboardEvent<HTMLButtonElement>) => { 
      if (event.key === key) { event?.currentTarget.click(); }
    }
  };

  const handleCtrlKey = (key: string) => {
    return (event: React.KeyboardEvent<HTMLButtonElement>) => { 
      if (event.ctrlKey && event.key === key) { event?.currentTarget.click(); }
    }
  };

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const handleAlgarism = debounce((e: any) => {
    if (/[a-zA-Z ]/.test(result)) return;
    if (result.length >= 32) {
      const lastResult = result;
      setResult("input > 31 chars");
      setTimeout(() => {
        setResult(lastResult);
      }, 2000);
      return;
    }
    if (e.target.name == "." && dot) return;
    if (e.target.name == "." && !dot) {
      setResult(result.concat(e.target.name));
      setDot(true);
      return;
    }
    let vresult: string = result;
    if (operation.length == 0 && result.charAt(0) === "0") {
      vresult = result.slice(1, result.length);
    }
    setResult(vresult.concat(e.target.name));
  });

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const handleOperation = (e: any) => {
    if (/[a-zA-Z ]/.test(result)) return;
    const op = e.target.name;
    const isDot = op == ".";
    const isPlus = op == "+";
    const isMinus = op == "-";
    const isDivide = op == "÷";
    const isTimes = op == "×";
    const isSquareRoot = op == "√";
    const hasSquareRoot = result.length > 0 && result.charAt(0) == "√";
    const hasOperation = result.length > 0 && operation.length > 0;
    if (/[\d.]+$/.test(result) && hasSquareRoot) {
      return;
    }
    if (/^[\d.]+$/.test(result) && isSquareRoot) {
      setResult("√" + result);
      return;
    }
    if (result.length == 1 && isDot) {
      return;
    }
    if (operation != '-' && (hasOperation || hasSquareRoot)) {
      return;
    }
    if (result.length == 0 && (isPlus || isTimes || isDivide)) {
      return;
    }
    if (isMinus) {
      if (hasOperation && operation != '-' && result.charAt(result.length - 1) == "-") {
        return;
      }
      if (hasSquareRoot || result.length == 0) {
        setResult(result.concat(op));
        return;
      }
      if (result.length > 2 && result.charAt(result.length - 2) == "-" && result.charAt(result.length - 1) == "-") {
        return;
      }
      if (
        result.length > 1 &&
        result.charAt(result.length - 1) == "-" &&
        /\d/.test(result.charAt(result.length - 2))
      ) {
        setOperation(op);
        setResult(result.concat(op));
        return;
      }
    }
    if (!hasOperation) {
      setOperation(op);
      setDot(false);
      setResult(result.concat(op));
    }
  };

  const handleClear = () => {
    setDot(false);
    setOperation("");
    setResult("");
  };

  const handleBackspace = () => {
    if (/[a-zA-Z ]/.test(result)) return;
    if (
      result.length > 2 &&
      result.charAt(result.length - 2) == "-" &&
      result.charAt(result.length - 1) == "-"
    ) {
      setResult(result.slice(0, result.length - 1));
      return;
    }
    if (result.charAt(result.length - 1) == ".") {
      setDot(false);
    }
    for (const op of ["√", "×", "÷", "+", "-"]) {
      if (result.charAt(result.length - 1) == op) {
        setOperation("");
        break;
      }
    }
    setResult(result.slice(0, result.length - 1));
  };

  const randomString = () => {
    doRandomRemote();
  };

  const calculate = () => {
    if (
      result.length == 0 ||
      (result.length > 0 && result.charAt(result.length - 1) == ".")
    ) {
      return;
    }
    try {
      setOperation("");
      const vresult = result;
      if (vresult.includes("+")) {
        doOperationRemote({
          operation: "ADDITION",
          amount: vresult.replace("+", " "),
        });
      } else if (vresult.includes("×")) {
        doOperationRemote({
          operation: "MULTIPLICATION",
          amount: vresult.replace("×", " "),
        });
      } else if (vresult.includes("÷")) {
        doOperationRemote({
          operation: "DIVISION",
          amount: vresult.replace("÷", " "),
        });
      } else if (vresult.includes("√")) {
        doOperationRemote({
          operation: "SQUARE_ROOT",
          amount: vresult.replace("√", ""),
        });
      } else if (vresult.includes("-")) {
        if (vresult.includes("--")) {
          doOperationRemote({
            operation: "SUBTRACTION",
            amount: vresult.replace("--", " -"),
          });
        } else {
          doOperationRemote({
            operation: "SUBTRACTION",
            amount: vresult.replace("-", " "),
          });
        }
      }
    } catch (err) {
      setResult("Error: " + err);
    }
  };

  return (
    <div>
      <CalculatorHelpComponent help={help} setHelp={setHelp} />
      <BalanceService balance={balance} setBalance={setBalance} />
      <RecordLog/>
      <div className="container">
        <form action="">
          <input type="text" value={result} readOnly />
        </form>
        <div className="keypad">
          {" "}
          <button aria-label="Help ? key" onKeyUp={handleKey('l')} onClick={() => setHelp(true)} className="color" >
            ?
          </button>
          <button aria-label="Clear delete key" onKeyUp={handleCtrlKey('Delete')} onClick={handleClear} className="color">
            ⇤
          </button>
          <button aria-label="Backspace backspace key" onKeyUp={handleCtrlKey('Backspace')} onClick={handleBackspace} className="backspace color">
            ←
          </button>
          <button aria-label="Logout esc key" onKeyUp={handleCtrlKey('Escape')} name="logout" onClick={onLogout} className="color">
            <LogoutIcon/>
          </button>
          <button aria-label="Records log l key" onKeyUp={handleKey('l')} name="log" onClick={handleLog} className="color">
           ☰
          </button>
          <button
            aria-label="Random string r key" 
            name="random_str"
            onClick={randomString}
            onKeyUp={handleKey('r')}
            className="random-string color"
          >
           random
          </button>
          <button accessKey="s" aria-label="Square Root s key" name="√" onKeyUp={handleKey('s')} onClick={handleOperation} className="color">
            √
          </button>
          <button aria-label="7" name="7" onClick={handleAlgarism} onKeyUp={handleKey('7')} className="digit">
            7
          </button>
          <button aria-label="8" name="8" onClick={handleAlgarism} onKeyUp={handleKey('8')} className="digit">
            8
          </button>
          <button aria-label="9" name="9" onClick={handleAlgarism} onKeyUp={handleKey('9')} className="digit">
            9
          </button>
          <button aria-label="Multiplication" name="×" onKeyUp={handleKey('*')} onClick={handleOperation} className="color">
            ×
          </button>
          <button aria-label="4" name="4" onClick={handleAlgarism} onKeyUp={handleKey('4')} className="digit">
            4
          </button>
          <button aria-label="5"  name="5" onClick={handleAlgarism} onKeyUp={handleKey('5')} className="digit">
            5
          </button>
          <button aria-label="6" name="6" onClick={handleAlgarism} onKeyUp={handleKey('6')} className="digit">
            6
          </button>
          <button aria-label="Division" name="÷" onClick={handleOperation} onKeyUp={handleKey('/')} className="color">
            ÷
          </button>
          <button aria-label="1" name="1" onClick={handleAlgarism} onKeyUp={handleKey('1')} className="digit">
            1
          </button>
          <button aria-label="2" name="2" onClick={handleAlgarism} onKeyUp={handleKey('2')} className="digit">
            2
          </button>
          <button aria-label="3" name="3" onClick={handleAlgarism} onKeyUp={handleKey('3')} className="digit">
            3
          </button>
          <button aria-label="Addition" name="+" onClick={handleOperation} onKeyUp={handleKey('+')} className="color">
            +
          </button>
          <button aria-label="0" name="0" onClick={handleAlgarism} onKeyUp={handleKey('0')} className="digit">
            0
          </button>
          <button aria-label="." name="." onClick={handleAlgarism} onKeyUp={handleKey('.')} className="digit">
            .
          </button>
          <button aria-label='Calculate key Enter' onClick={calculate} className="color" onKeyUp={handleCtrlKey('Enter')}>
            =
          </button>
          <button name="-" onClick={handleOperation} className="color">
            -
          </button>
        </div>
      </div>
    </div>
  );
};

export default Calculator;


