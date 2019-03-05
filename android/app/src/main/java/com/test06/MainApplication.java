package com.test06;

import android.app.Application;

import com.facebook.react.ReactApplication;
import com.dieam.reactnativepushnotification.ReactNativePushNotificationPackage;
import com.horcrux.svg.SvgPackage;
import com.facebook.react.ReactNativeHost;
import com.facebook.react.ReactPackage;
import com.facebook.react.shell.MainReactPackage;
import com.facebook.soloader.SoLoader;
import com.BV.LinearGradient.LinearGradientPackage;
import com.horcrux.svg.SvgPackage;

import java.util.Arrays;
import java.util.List;

import com.reactnativenavigation.NavigationApplication;
import com.reactlibrary.securekeystore.RNSecureKeyStorePackage;
import com.AlexanderZaytsev.RNI18n.RNI18nPackage;

public class MainApplication extends NavigationApplication  {

  @Override
     public boolean isDebug() {
         // Make sure you are using BuildConfig from your own application
         return BuildConfig.DEBUG;
     }

     protected List<ReactPackage> getPackages() {
         // Add additional packages you require here
         // No need to add RnnPackage and MainReactPackage
         return Arrays.<ReactPackage>asList(
             // eg. new VectorIconsPackage()
             new ReactNativePushNotificationPackage(),
             new RNI18nPackage(),
             new RNSecureKeyStorePackage(),
			 new SvgPackage(),
       new LinearGradientPackage()
         );
     }

     @Override
     public List<ReactPackage> createAdditionalReactPackages() {
         return getPackages();
     }

     @Override
      public String getJSMainModuleName() {
          return "index";
      }

}
