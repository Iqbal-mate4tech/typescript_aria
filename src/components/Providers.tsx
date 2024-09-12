
// // Type Imports
// import type { ChildrenType, Direction } from '@core/types';

// // Context Imports
// import { VerticalNavProvider } from '@menu/contexts/verticalNavContext';
// import { SettingsProvider } from '@core/contexts/settingsContext';
// import ThemeProvider from '@components/theme';
// import ReduxProvider from '@components/ReduxProvider';

// // Util Imports
// import { getDemoName, getMode, getSettingsFromCookie, getSystemMode } from '@core/utils/serverHelpers';

// type Props = ChildrenType & {
//   direction: Direction;
// };

// const Providers = (props: Props) => {
//   // Props
//   const { children, direction } = props;

//   // Vars
//   const mode = getMode();
//   const settingsCookie = getSettingsFromCookie();
//   const demoName = getDemoName();
//   const systemMode = getSystemMode();

//   return (
//     <ReduxProvider>
//       <VerticalNavProvider>
//         <SettingsProvider settingsCookie={settingsCookie} mode={mode} demoName={demoName}>
//           <ThemeProvider direction={direction} systemMode={systemMode}>
//             {children}
//           </ThemeProvider>
//         </SettingsProvider>
//       </VerticalNavProvider>
//     </ReduxProvider>
//   );
// };

// export default Providers;

// Type Imports
import type { ReactNode } from 'react';

import type { Direction } from '@core/types';

// Context Imports
import { VerticalNavProvider } from '@menu/contexts/verticalNavContext';
import { SettingsProvider } from '@core/contexts/settingsContext';
import ThemeProvider from '@components/theme';
import ReduxProvider from '@components/ReduxProvider';

// Util Imports
import { getDemoName, getMode, getSettingsFromCookie, getSystemMode } from '@core/utils/serverHelpers';

type Props = {
  children: ReactNode;   // Define children prop as ReactNode to support all JSX elements
  direction: Direction;  // Direction type imported from your core types
};

const Providers = ({ children, direction }: Props) => {
  // Vars
  const mode = getMode(); // Retrieve mode (dark/light)
  const settingsCookie = getSettingsFromCookie(); // Retrieve settings from cookies
  const demoName = getDemoName(); // Get demo name, probably for feature flagging or environment-specific behavior
  const systemMode = getSystemMode(); // Get system mode (if your app has system-level theming)

  return (
    <ReduxProvider>
      <VerticalNavProvider>
        <SettingsProvider settingsCookie={settingsCookie} mode={mode} demoName={demoName}>
          <ThemeProvider direction={direction} systemMode={systemMode}>
            {children}
          </ThemeProvider>
        </SettingsProvider>
      </VerticalNavProvider>
    </ReduxProvider>
  );
};

export default Providers;
