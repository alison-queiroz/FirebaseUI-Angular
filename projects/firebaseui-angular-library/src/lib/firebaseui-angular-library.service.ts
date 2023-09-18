import { Inject, Injectable, NgZone, Optional } from '@angular/core';
import * as firebaseui from 'firebaseui';
import { FIREBASE_APP_NAME, FIREBASE_OPTIONS, FirebaseApp, ɵfirebaseAppFactory } from '@angular/fire/compat';
import { FirebaseOptions, FirebaseAppSettings } from 'firebase/app';

import _firebase from 'firebase/compat/app';
import { USE_EMULATOR as USE_AUTH_EMULATOR } from '@angular/fire/compat/auth';

type UseEmulatorArguments = [string, number];

@Injectable()
export class FirebaseuiAngularLibraryService {
  public readonly firebaseUiInstance: firebaseui.auth.AuthUI;

  constructor(@Inject(FIREBASE_OPTIONS) private readonly options: FirebaseOptions,
    @Optional() @Inject(FIREBASE_APP_NAME) private readonly nameOrConfig: string | FirebaseAppSettings | null | undefined,
    @Optional() @Inject(USE_AUTH_EMULATOR) private readonly _useEmulator: any,
    private readonly zone: NgZone) {
    // noinspection JSNonASCIINames
    const app: FirebaseApp = ɵfirebaseAppFactory(options, zone, nameOrConfig);

    const useEmulator: UseEmulatorArguments | null = _useEmulator;

    if (!(<any>window).firebaseUiInstance) {
      const auth: _firebase.auth.Auth = app.auth();
      if (useEmulator) {
        const connectionString = useEmulator[0].startsWith('http') ? useEmulator[0] : `http://${useEmulator.join(':')}`;
        auth.useEmulator(connectionString);
      }
      (<any>window).firebaseUiInstance = new firebaseui.auth.AuthUI(auth);
    }
    // store the firebaseui instance on the window object to prevent double initialization
    this.firebaseUiInstance = (<any>window).firebaseUiInstance as firebaseui.auth.AuthUI;
  }
}
