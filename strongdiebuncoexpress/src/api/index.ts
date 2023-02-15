/* eslint-disable */
/* tslint:disable */
/*
 * ---------------------------------------------------------------
 * ## THIS FILE WAS GENERATED VIA SWAGGER-TYPESCRIPT-API        ##
 * ##                                                           ##
 * ## AUTHOR: acacode                                           ##
 * ## SOURCE: https://github.com/acacode/swagger-typescript-api ##
 * ---------------------------------------------------------------
 */

export interface ApplicationUser {
  /** @format int32 */
  id?: number
  name?: string | null
  /** @format int32 */
  wins?: number
  /** @format int32 */
  losses?: number
  loadedDieSettings?: LoadedDieSetting[] | null
}

export interface GameDetailsRequest {
  /**
   * @format int32
   * @min 1
   * @max 2147483647
   */
  gameID: number
}

export interface GameDetailsResponse {
  details?: GameListDetail
}

export interface GameListDetail {
  /** @format int32 */
  gameID?: number
  players?: Player[] | null
}

export type GameListRequest = object

export interface GameListResponse {
  games?: GameListDetail[] | null
}

export interface JoinGameRequest {
  /** @format int32 */
  userID?: number | null
  userName: string
  /**
   * @format int32
   * @min 1
   * @max 2147483647
   */
  gameID: number
}

export interface JoinGameResponse {
  player?: Player
  /** @format int32 */
  gameID?: number
  players?: Player[] | null
}

export interface LoadDiceResponse {
  updatedLoadedDieSettings?: LoadedDieSetting[] | null
}

export interface LoadDiceSettingsRequest {
  /** @format int32 */
  userID: number
  loadedDieSettings?: LoadedSetting[] | null
}

export interface LoadedDiceDetailsRequest {
  /**
   * @format int32
   * @min 1
   * @max 2147483647
   */
  settingsID: number
}

export interface LoadedDiceDetailsResponse {
  details?: LoadedSetting
}

export interface LoadedDiceListRequest {
  /** @format int32 */
  userID?: number | null
  userName?: string | null
}

export interface LoadedDiceListResponse {
  loadedDieSettings?: LoadedSetting[] | null
}

export interface LoadedDie {
  /** @format int32 */
  index?: number | null
  /**
   * @format int32
   * @min 1
   * @max 6
   */
  favor?: number
  /**
   * @format int32
   * @min 1
   * @max 5
   */
  factor?: number
}

export interface LoadedDieSetting {
  /** @format int32 */
  id?: number
  /** @format int32 */
  index?: number
  /** @format int32 */
  favor?: number
  /** @format int32 */
  factor?: number
  user?: ApplicationUser
  /** @format int32 */
  userID?: number
}

export interface LoadedSetting {
  /** @format int32 */
  id?: number | null
  /** @format int32 */
  userID?: number
  /** @format int32 */
  index?: number
  /** @format int32 */
  favor?: number
  /** @format int32 */
  factor?: number
}

export interface Player {
  /** @format int32 */
  userID?: number
  userName?: string | null
}

export interface ProblemDetails {
  type?: string | null
  title?: string | null
  /** @format int32 */
  status?: number | null
  detail?: string | null
  instance?: string | null
}

export interface RollDiceRequest {
  /** @format int32 */
  userID?: number | null
  userName?: string | null
  /** @format int32 */
  gameID?: number | null
  /**
   * @format int32
   * @min 1
   * @max 10
   */
  numberOfDiceToRoll: number
  loadedDiceSettings?: LoadedDie[] | null
}

export interface RollDiceResponse {
  dieRollResults?: number[] | null
}

import axios, { AxiosInstance, AxiosRequestConfig, AxiosResponse, HeadersDefaults, ResponseType } from 'axios'

export type QueryParamsType = Record<string | number, any>

export interface FullRequestParams extends Omit<AxiosRequestConfig, 'data' | 'params' | 'url' | 'responseType'> {
  /** set parameter to `true` for call `securityWorker` for this request */
  secure?: boolean
  /** request path */
  path: string
  /** content type of request body */
  type?: ContentType
  /** query params */
  query?: QueryParamsType
  /** format of response (i.e. response.json() -> format: "json") */
  format?: ResponseType
  /** request body */
  body?: unknown
}

export type RequestParams = Omit<FullRequestParams, 'body' | 'method' | 'query' | 'path'>

export interface ApiConfig<SecurityDataType = unknown> extends Omit<AxiosRequestConfig, 'data' | 'cancelToken'> {
  securityWorker?: (securityData: SecurityDataType | null) => Promise<AxiosRequestConfig | void> | AxiosRequestConfig | void
  secure?: boolean
  format?: ResponseType
}

export enum ContentType {
  Json = 'application/json',
  FormData = 'multipart/form-data',
  UrlEncoded = 'application/x-www-form-urlencoded',
}

export class HttpClient<SecurityDataType = unknown> {
  public instance: AxiosInstance
  private securityData: SecurityDataType | null = null
  private securityWorker?: ApiConfig<SecurityDataType>['securityWorker']
  private secure?: boolean
  private format?: ResponseType

  constructor({ securityWorker, secure, format, ...axiosConfig }: ApiConfig<SecurityDataType> = {}) {
    this.instance = axios.create({ ...axiosConfig, baseURL: axiosConfig.baseURL || '' })
    this.secure = secure
    this.format = format
    this.securityWorker = securityWorker
  }

  public setSecurityData = (data: SecurityDataType | null) => {
    this.securityData = data
  }

  protected mergeRequestParams(params1: AxiosRequestConfig, params2?: AxiosRequestConfig): AxiosRequestConfig {
    const method = params1.method || (params2 && params2.method)

    return {
      ...this.instance.defaults,
      ...params1,
      ...(params2 || {}),
      headers: {
        ...((method && this.instance.defaults.headers[method.toLowerCase() as keyof HeadersDefaults]) || {}),
        ...(params1.headers || {}),
        ...((params2 && params2.headers) || {}),
      },
    }
  }

  protected stringifyFormItem(formItem: unknown) {
    if (typeof formItem === 'object' && formItem !== null) {
      return JSON.stringify(formItem)
    } else {
      return `${formItem}`
    }
  }

  protected createFormData(input: Record<string, unknown>): FormData {
    return Object.keys(input || {}).reduce((formData, key) => {
      const property = input[key]
      const propertyContent: Iterable<any> = property instanceof Array ? property : [property]

      for (const formItem of propertyContent) {
        const isFileType = formItem instanceof Blob || formItem instanceof File
        formData.append(key, isFileType ? formItem : this.stringifyFormItem(formItem))
      }

      return formData
    }, new FormData())
  }

  public request = async <T = any, _E = any>({ secure, path, type, query, format, body, ...params }: FullRequestParams): Promise<AxiosResponse<T>> => {
    const secureParams = ((typeof secure === 'boolean' ? secure : this.secure) && this.securityWorker && (await this.securityWorker(this.securityData))) || {}
    const requestParams = this.mergeRequestParams(params, secureParams)
    const responseFormat = format || this.format || undefined

    if (type === ContentType.FormData && body && body !== null && typeof body === 'object') {
      body = this.createFormData(body as Record<string, unknown>)
    }

    return this.instance.request({
      ...requestParams,
      headers: {
        ...(requestParams.headers || {}),
        ...(type && type !== ContentType.FormData ? { 'Content-Type': type } : {}),
      },
      params: query,
      responseType: responseFormat,
      data: body,
      url: path,
    })
  }
}

/**
 * @title StrongDieAPI
 * @version 1.0
 */
export class Api<SecurityDataType extends unknown> extends HttpClient<SecurityDataType> {
  api = {
    /**
     * No description
     *
     * @tags Actions
     * @name ActionsRollCreate
     * @request POST:/api/actions/roll
     */
    actionsRollCreate: (data: RollDiceRequest, params: RequestParams = {}) =>
      this.request<RollDiceResponse, ProblemDetails>({
        path: `/api/actions/roll`,
        method: 'POST',
        body: data,
        type: ContentType.Json,
        format: 'json',
        ...params,
      }),

    /**
     * No description
     *
     * @tags Game
     * @name GameJoinCreate
     * @request POST:/api/game/join
     */
    gameJoinCreate: (data: JoinGameRequest, params: RequestParams = {}) =>
      this.request<JoinGameResponse, ProblemDetails>({
        path: `/api/game/join`,
        method: 'POST',
        body: data,
        type: ContentType.Json,
        format: 'json',
        ...params,
      }),

    /**
     * No description
     *
     * @tags Game
     * @name GameListCreate
     * @request POST:/api/game/list
     */
    gameListCreate: (data: GameListRequest, params: RequestParams = {}) =>
      this.request<GameListResponse, ProblemDetails>({
        path: `/api/game/list`,
        method: 'POST',
        body: data,
        type: ContentType.Json,
        format: 'json',
        ...params,
      }),

    /**
     * No description
     *
     * @tags Game
     * @name GameDetailsCreate
     * @request POST:/api/game/details
     */
    gameDetailsCreate: (data: GameDetailsRequest, params: RequestParams = {}) =>
      this.request<GameDetailsResponse, ProblemDetails>({
        path: `/api/game/details`,
        method: 'POST',
        body: data,
        type: ContentType.Json,
        format: 'json',
        ...params,
      }),

    /**
     * No description
     *
     * @tags LoadedDiceSettings
     * @name LoadedDiceUpdateCreate
     * @request POST:/api/loadedDice/update
     */
    loadedDiceUpdateCreate: (data: LoadDiceSettingsRequest, params: RequestParams = {}) =>
      this.request<LoadDiceResponse, ProblemDetails>({
        path: `/api/loadedDice/update`,
        method: 'POST',
        body: data,
        type: ContentType.Json,
        format: 'json',
        ...params,
      }),

    /**
     * No description
     *
     * @tags LoadedDiceSettings
     * @name LoadedDiceListCreate
     * @request POST:/api/loadedDice/list
     */
    loadedDiceListCreate: (data: LoadedDiceListRequest, params: RequestParams = {}) =>
      this.request<LoadedDiceListResponse, ProblemDetails>({
        path: `/api/loadedDice/list`,
        method: 'POST',
        body: data,
        type: ContentType.Json,
        format: 'json',
        ...params,
      }),

    /**
     * No description
     *
     * @tags LoadedDiceSettings
     * @name LoadedDiceDetailsCreate
     * @request POST:/api/loadedDice/details
     */
    loadedDiceDetailsCreate: (data: LoadedDiceDetailsRequest, params: RequestParams = {}) =>
      this.request<LoadedDiceDetailsResponse, ProblemDetails>({
        path: `/api/loadedDice/details`,
        method: 'POST',
        body: data,
        type: ContentType.Json,
        format: 'json',
        ...params,
      }),
  }
}
