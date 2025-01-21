import { container } from 'tsyringe';
import { AppAuthController } from '../../infrastructure/api/app-auth/controller';
import { AppEmailVerificationController } from '../../infrastructure/api/app-email-verification/controller';
import { ListManagementController } from '../../infrastructure/api/app-list-management/controller';
import { AppRefreshTokenController } from '../../infrastructure/api/app-refresh-token/controller';
import { WebSocketClientService } from '../../infrastructure/webSockets/services';
import { AppForTestsController } from '../../infrastructure/api/app-for-tests/controller';

export function initContainers() {
  container.register(AppAuthController, AppAuthController);
  container.register(AppRefreshTokenController, AppRefreshTokenController);
  container.register(AppEmailVerificationController, AppEmailVerificationController);
  container.register(ListManagementController, ListManagementController);
  container.register(AppForTestsController, AppForTestsController);
  container.registerSingleton(WebSocketClientService, WebSocketClientService);
}
