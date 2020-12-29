export const PLC_REMOTE_API_REQ = "pugin-consumer/remote-api/request"
export const PLC_REMOTE_API_RES = "pugin-consumer/remote-api/response"


export interface NetworkRequest {
    requestId: string,
    method: 'post' | 'get' | 'put' | 'patch' | 'head',
    url: string,
    data?: object,
    headers?: object
}
