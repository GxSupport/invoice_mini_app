import { Placeholder, Button, Banner } from '@telegram-apps/telegram-ui';
import { AlertCircle } from 'lucide-react';
import type { FC } from 'react';

import { Page } from '@/components/Page';
import { ShimmerLoader } from '@/pages/ActList/components/ShimmerLoader';
import type { ActDetail } from '@/types/act/detail';

import { ActHeader } from './components/ActHeader';
import { ActSeller } from './components/ActSeller';
import { ActAmount } from './components/ActAmount';
import { ActProducts } from './components/ActProducts';
import { ActMetadata } from './components/ActMetadata';

interface ActDetailsPageProps {
  act: ActDetail | null;
  isLoading: boolean;
  error: string | null;
  onRetry: () => void;
  actId: string;
}

export const ActDetailsPage: FC<ActDetailsPageProps> = ({
  act,
  isLoading,
  error,
  onRetry,
  actId
}) => {
  return (
    <Page back={true}>
      <div style={{
        minHeight: '100vh',
        backgroundColor: 'var(--tg-theme-secondary-bg-color, #f5f5f5)'
      }}>
        {/* Loading State */}
        {isLoading && (
          <div>
            {/* Header Shimmer */}
            <div style={{
              padding: '20px 16px',
              backgroundColor: 'var(--tg-theme-bg-color, #ffffff)',
              borderBottom: '1px solid var(--tg-theme-separator-color, #e5e5e5)'
            }}>
              <ShimmerLoader itemCount={1} />
            </div>

            {/* Content Shimmer */}
            <div style={{ marginTop: '8px' }}>
              <ShimmerLoader itemCount={3} />
            </div>
          </div>
        )}

        {/* Error State */}
        {error && !isLoading && (
          <div style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            padding: '40px 16px',
            gap: '16px'
          }}>
            <AlertCircle size={48} color="var(--tg-theme-destructive-text-color, #ff0000)" />
            <Placeholder
              header="Ошибка загрузки"
              description={error}
            >
              <Button
                size="s"
                onClick={onRetry}
                style={{
                  backgroundColor: 'var(--tg-theme-button-color, #007AFF)',
                  color: 'var(--tg-theme-button-text-color, #ffffff)'
                }}
              >
                Повторить
              </Button>
            </Placeholder>
          </div>
        )}

        {/* Content */}
        {act && !isLoading && !error && (
          <div style={{
            display: 'flex',
            flexDirection: 'column',
            gap: '8px'
          }}>
            {/* Header Section */}
            <ActHeader act={act} />

            {/* Last Error Banner */}
            {act.lasterror && (
              <div style={{ padding: '0 16px' }}>
                <Banner
                  type="section"
                  header="Последняя ошибка"
                  description={act.lasterror}
                />
              </div>
            )}

            {/* Deep link example - using window.location.href instead of Link */}
              <div style={{ padding: '0 16px' }}>
                <button
                  onClick={() => window.location.href = 'eimzo://sign?qc=Test'}
                  style={{
                    textDecoration: 'none',
                    backgroundColor: 'var(--tg-theme-button-color, #007AFF)',
                    color: 'var(--tg-theme-button-text-color, #ffffff)',
                    border: 'none',
                    padding: '8px 16px',
                    borderRadius: '8px'
                  }}
                >
                  Open Deep Link
                </button>
              </div>


            {/* Seller/Buyer Section */}
            <div style={{
              backgroundColor: 'var(--tg-theme-bg-color, #ffffff)'
            }}>
              <ActSeller act={act} />
            </div>

            {/* Products Section */}
            <div style={{
              backgroundColor: 'var(--tg-theme-bg-color, #ffffff)'
            }}>
              <ActProducts products={act.productlist} payableTotal={act.payabletotal} actId={actId} />
            </div>

            {/* Amount Section */}
            <div style={{
              backgroundColor: 'var(--tg-theme-bg-color, #ffffff)'
            }}>
              <ActAmount amount={act.payabletotal} />
            </div>

            {/* Metadata Section */}
            <div style={{
              backgroundColor: 'var(--tg-theme-bg-color, #ffffff)'
            }}>
              <ActMetadata act={act} />
            </div>

            {/* Bottom Padding */}
            <div style={{ height: '20px' }} />
          </div>
        )}

        {/* Not Found State */}
        {!act && !isLoading && !error && (
          <div style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            padding: '40px 16px',
            gap: '16px'
          }}>
            <AlertCircle size={48} color="var(--tg-theme-hint-color, #999999)" />
            <Placeholder
              header="Акт не найден"
              description="Запрошенный документ не существует или был удален."
            />
          </div>
        )}
      </div>
    </Page>
  );
};
