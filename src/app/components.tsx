import { useId, useRef, useEffect, type ReactNode } from 'react';
import { LockKeyhole, ArrowRight, Phone, ShieldCheck, Leaf, X } from 'lucide-react';
import { SafeLink, useApp, useVault } from './context';
import { Unlock } from '../features/Unlock';
export function PageTitle({
  eyebrow,
  children,
  description,
}: {
  eyebrow?: string;
  children: ReactNode;
  description?: string;
}) {
  return (
    <header className="page-title">
      {eyebrow && <p className="eyebrow">{eyebrow}</p>}
      <h1 tabIndex={-1}>{children}</h1>
      {description && <p className="lede">{description}</p>}
    </header>
  );
}
export function PrivateGate({ children }: { children: ReactNode }) {
  const session = useVault();
  return session.data && session.status === 'unlocked' ? children : <Unlock embedded />;
}
export function HelpBar() {
  return (
    <nav className="help-bar" aria-label="Apoyo disponible">
      <SafeLink to="/skills">
        <Leaf size={19} aria-hidden="true" /> Otra habilidad
      </SafeLink>
      <SafeLink to="/support">
        <Phone size={19} aria-hidden="true" /> Pedir apoyo
      </SafeLink>
      <SafeLink to="/emergency" className="help-emergency">
        Emergencias <ArrowRight size={18} aria-hidden="true" />
      </SafeLink>
    </nav>
  );
}
export function PrivacyNote() {
  return (
    <p className="privacy-note">
      <ShieldCheck size={17} aria-hidden="true" /> Tu información personal se guarda cifrada en este
      navegador.
    </p>
  );
}
export function LockedNote() {
  return (
    <div className="notice">
      <LockKeyhole size={20} aria-hidden="true" />
      <p>Tu plan está bloqueado. Las guías públicas siguen disponibles.</p>
      <SafeLink to="/unlock">Ver mi plan</SafeLink>
    </div>
  );
}
export function EmptyState({ title, children }: { title: string; children: ReactNode }) {
  return (
    <div className="empty-state">
      <Leaf size={32} aria-hidden="true" />
      <h2>{title}</h2>
      {children}
    </div>
  );
}
export function Check({
  children,
  checked,
  onChange,
  required = false,
}: {
  children: ReactNode;
  checked: boolean;
  onChange: (value: boolean) => void;
  required?: boolean;
}) {
  return (
    <label className="check">
      <input
        type="checkbox"
        checked={checked}
        onChange={(e) => onChange(e.target.checked)}
        required={required}
      />
      <span>{children}</span>
    </label>
  );
}
export function TextField({
  label,
  value,
  onChange,
  multiline = false,
  help,
  maxLength = 500,
  required = false,
  type = 'text',
}: {
  label: string;
  value: string;
  onChange: (s: string) => void;
  multiline?: boolean;
  help?: string;
  maxLength?: number;
  required?: boolean;
  type?: string;
}) {
  const id = useId();
  const common = {
    id,
    value,
    onChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) =>
      onChange(e.target.value),
    maxLength,
    required,
    'aria-describedby': help ? `${id}-help` : undefined,
  };
  return (
    <div className="field">
      <label htmlFor={id}>{label}</label>
      {help && (
        <p id={`${id}-help`} className="field-help">
          {help}
        </p>
      )}
      {multiline ? (
        <textarea {...common} rows={4} />
      ) : (
        <input
          {...common}
          type={type}
          autoComplete={type === 'password' ? 'current-password' : 'off'}
        />
      )}
    </div>
  );
}
export function Dialog({
  title,
  children,
  onClose,
}: {
  title: string;
  children: ReactNode;
  onClose: () => void;
}) {
  const { dirty } = useApp();
  const close = () => {
    if (!dirty || window.confirm('¿Descartar los cambios sin guardar?')) onClose();
  };
  const ref = useRef<HTMLDialogElement>(null);
  const id = useId();
  useEffect(() => {
    const previous = document.activeElement as HTMLElement | null;
    ref.current?.showModal();
    return () => {
      previous?.focus();
    };
  }, []);
  return (
    <dialog
      ref={ref}
      aria-labelledby={id}
      onCancel={(event) => {
        event.preventDefault();
        close();
      }}
    >
      <div className="dialog-header">
        <h2 id={id}>{title}</h2>
        <button onClick={close} className="icon-button" aria-label="Cerrar diálogo">
          <X aria-hidden="true" />
        </button>
      </div>
      {children}
    </dialog>
  );
}
