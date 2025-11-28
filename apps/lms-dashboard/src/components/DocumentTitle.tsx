import { useEffect } from 'react';
import { useTenant } from '../context/TenantContext';

export function DocumentTitle() {
  const { tenantInfo } = useTenant();

  useEffect(() => {
    if (tenantInfo?.pageTitle) {
      document.title = tenantInfo.pageTitle;
    } else {
      document.title = 'LMS Dashboard';
    }
  }, [tenantInfo?.pageTitle]);

  return null;
}

