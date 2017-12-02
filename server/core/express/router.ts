import { Router as ExpressRouter } from 'express';

import { Server } from './../server';
import { IRequest } from './../../core/models/express/request';
import { IResponse } from './../../core/models/express/response';
import { NotImplementedError } from './../error/user-friendly';

export class Router {
  server: Server;
  router: ExpressRouter;

  constructor(server: Server) {
    this.server = server;
    
    this.router = ExpressRouter();
  }

  initRoutes() {
    throw new NotImplementedError();
  }

  build(): ExpressRouter {
    this.initRoutes();

    return this.router;
  }

  getUserId(request: IRequest): string {
    let id = this.server.systemUserId;
    if(request.user) {
      id = request.user._id;
    }

    return id;
  }

  handleError(error: any, request: IRequest, response: IResponse): any {
    let emptyObject = JSON.stringify({});
    response.onErrorRequestData = {
      userIdentifier: request.user ? request.user.email : undefined,
      url: request.originalUrl,
      params: emptyObject === JSON.stringify(request.params) ? undefined : request.params,
      body: emptyObject === JSON.stringify(request.body) ? undefined : request.body
    }

    return error;
  }
}