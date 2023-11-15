import cx from 'classnames';
import { Icon } from '@iconify/react';
import { DropDown } from '../DropDown';

const MenuItemLabel = ({
  label,
  isActive,
}: {
  label: string;
  isActive: boolean;
}) => {
  return (
    <div className="justify-normal flex w-full flex-shrink-0 items-center gap-1 whitespace-nowrap">
      <Icon
        icon="ic:round-check"
        className={cx('opacity-0', {
          'opacity-100': isActive,
        })}
      />
      <span
        className={cx({
          'font-semibold text-black dark:text-white': isActive,
        })}
      >
        {label}
      </span>
    </div>
  );
};

const MenuItemHeader = ({ label }: { label: string }) => {
  return (
    <div className="relative flex w-full min-w-44 items-center justify-between gap-1 whitespace-nowrap">
      <div className="absolute inset-0 flex items-center" aria-hidden="true">
        <div className="w-full border-t border-gray-300 dark:border-gray-600" />
      </div>
      <span className="mxl-1 z-10 flex-shrink-0 bg-slate-100 pr-2 dark:bg-slate-900">
        {label}
      </span>
    </div>
  );
};

export const DEBUGTOOLS = {
  LAYOUT: 'layout',
  CHAOS: 'chaos',
  HOSTILE: 'hostile',
  A11YCSS: 'a11ycss',
  ARIA: 'aria',
  ROLE: 'role',
  GRID: 'grid',
};

export const LAYOUT = [DEBUGTOOLS.LAYOUT, DEBUGTOOLS.GRID, DEBUGTOOLS.HOSTILE];
export const A11Y = [DEBUGTOOLS.A11YCSS];

interface Props {
  debugName: string | undefined;
  onChange: (name: string | undefined) => void;
}

export const DebugDropDown = ({ debugName, onChange }: Props) => {
  return (
    <DropDown
      className={cx('rounded-lg text-xs', {
        'bg-slate-400/60': debugName != null,
      })}
      label={<Icon icon="codicon:debug-alt-small" fontSize={18} />}
      options={[
        {
          label: <MenuItemHeader label="No deficiency" />,
          onClick: null,
        },
        {
          label: (
            <MenuItemLabel
              label="Disable debugtools"
              isActive={debugName === undefined}
            />
          ),
          onClick: () => {
            onChange(undefined);
          },
        },
        {
          label: <MenuItemHeader label="Layout &amp; components" />,
          onClick: null,
        },
        ...LAYOUT.map((x: string) => {
          return {
            label: (
              <MenuItemLabel
                label={x}
                isActive={debugName === x.toLowerCase()}
              />
            ),
            onClick: () => {
              onChange(x.toLowerCase());
            },
          };
        }),
        {
          label: <MenuItemHeader label="Accessibility  &amp; ARIA" />,
          onClick: null,
        },
        ...A11Y.map((x: string) => {
          return {
            label: (
              <MenuItemLabel
                label={x}
                isActive={debugName === x.toLowerCase()}
              />
            ),
            onClick: () => {
              onChange(x.toLowerCase());
            },
          };
        }),
      ]}
    />
  );
};
