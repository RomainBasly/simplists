import { container } from 'tsyringe';

import { WebSocketClientService } from '../webSockets/services';
import { AppAuthController } from '../api/app-auth/controller';
import { AppEmailVerificationController } from '../api/app-email-verification/controller';
import { ListManagementController } from '../api/app-list-management/controller';
import { AppRefreshTokenController } from '../api/app-refresh-token/controller';

export function initContainers() {
  container.register(AppAuthController, AppAuthController);
  container.register(AppRefreshTokenController, AppRefreshTokenController);
  container.register(AppEmailVerificationController, AppEmailVerificationController);
  container.register(ListManagementController, ListManagementController);
  container.registerSingleton(WebSocketClientService, WebSocketClientService);
}
