import React from "react";
import { render, screen, fireEvent, act } from "@testing-library/react";
import { describe, it, expect, vi, beforeEach } from "vitest";
import Calculator from "./CalculatorComponent";
import { ModalProvider } from "../Record/ReportController";

const mockRecords : string = `{
    "content": [
        {
            "id": "08c27836-f300-428e-9473-2e8621f844da",
            "date": "2024-11-23T13:18:17.824221Z",
            "operationResponse": "12345678",
            "operation": {
                "type": "RANDOM_STRING"
            },
            "amount": "",
            "userBalance": 100.00
        }
    ],
    "page": {
        "size": 2,
        "number": 0,
        "totalElements": 1,
        "totalPages": 1
    }
  }`;

describe("Calculator Component", () => {
  const mockRequest = vi.fn();

  beforeEach(() => {
    mockRequest.mockClear();
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  it("renders calculator and displays initial state", () => {
    global.fetch = vi.fn(() => Promise.resolve({ json: () => Promise.resolve(100) } as Response));
    
    render(
      <ModalProvider>
        <Calculator onLogout={mockRequest} />
      </ModalProvider>
    );
    
    // check input and some buttons render
    expect(screen.getByRole("textbox")).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Help ? key' })).toBeInTheDocument();
    expect(screen.getByText("=")).toBeInTheDocument();
    expect(screen.getByText("7")).toBeInTheDocument();
  });

  it("performs basic addition", async () => {

    global.fetch = vi.fn(() => Promise.resolve({ json: () => Promise.resolve({"balance":99.90,"operationResponse":"10"}), } as Response));

    render(      
    <ModalProvider>
      <Calculator onLogout={mockRequest} />
    </ModalProvider>
    );

    await act(async () => {
      // perform the operation 7 + 3
      fireEvent.click(screen.getByText("7"));
      fireEvent.click(screen.getByText("+"));
      fireEvent.click(screen.getByText("3"));
      fireEvent.click(screen.getByText("="));
    }).then(() => 
      setTimeout(() => {
        expect(screen.getByRole("textbox")).toHaveValue("10");
      }, 5000));    
  });

  it("renders the log records when the button ☰ is clicked", async () => {
    global.fetch = vi.fn(() => Promise.resolve({ json: () => Promise.resolve(mockRecords) } as Response));
    
    render(
      <ModalProvider>
        <Calculator onLogout={mockRequest} />
      </ModalProvider>
    );

    // open modal: display record logs
    await act(async () => fireEvent.click(screen.getByText("☰")));

    // check if modal is displayed (verify DELETE button)
    setTimeout(() => {
      expect(screen.getByRole('button', { name: /delete/i })).toBeInTheDocument();
    }, 2000);
  });
});
