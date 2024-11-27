
import OperationResponse from "./OperationResponse";
import OperationRequest from './OperationRequest';

const calculatorEndpoint = import.meta.env.VITE_APP_CALCULATOR_ENDPOINT || "";

const useRemoteCalculatorService = ({getResult, setBalance, setResult} : {
    getResult: () => string;
    setBalance: (value: number) => void;
    setResult: (value: string) => void;
  }) => {
  

  const header = {
    Authorization: sessionStorage.getItem('authorization') || '',
    "Content-Type": "application/json",
  };

  const doOperationRemote = (req: OperationRequest) => {
      return fetch(calculatorEndpoint, {
        method: "POST",
        headers: header,
        body: JSON.stringify(req),
        })
        .then((res) => res.json())
        .then((data: OperationResponse) => {
          if (data.balance != null) {
            setBalance(data.balance);
          }
          setResult(data.operationResponse);
        })
        .catch((err: unknown) => alert("Error: " + JSON.stringify(err)));
  };

  const doRandomRemote = () => {
    return fetch(calculatorEndpoint, {
      method: "POST",
      headers: header,
      body: JSON.stringify({ operation: "RANDOM_STRING" }),
    })
      .then((res) => res.json())
      .then((data: OperationResponse) => {
        if (data.balance != null) {
          setBalance(data.balance);
        } 
        if (/[\d]+$/.test(data.operationResponse)) {        
          setResult(getResult() + data.operationResponse);
        } else {
          setResult(getResult() + data.operationResponse);
        }
      })
      .catch((err: unknown) => alert("Error: " + JSON.stringify(err)));
  };

  return { doOperationRemote, doRandomRemote };
};

export default useRemoteCalculatorService;
