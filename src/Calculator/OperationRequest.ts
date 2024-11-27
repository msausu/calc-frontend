
interface OperationRequest {
    operation: 'ADDITION' | 'MULTIPLICATION' | 'SUBTRACTION' | 'DIVISION' | 'SQUARE_ROOT' | 'RANDOM_STRING';
    amount?: string;
}

export default OperationRequest;