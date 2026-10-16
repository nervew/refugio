import { useState } from 'react';
import { Phone, MessageCircle, Plus, ArrowUp, ArrowDown, Star } from 'lucide-react';
import { PageTitle, PrivateGate, TextField, EmptyState, Dialog, Check } from '../app/components';
import { SafeLink, useAction, useApp, useDraftState, useVault } from '../app/context';
import { vault } from '../security/vault';
import { useReturnHomeAfterSave } from '../app/save-navigation';
import { newId, now, phoneDestination, removeContact, saveContact } from '../domain/actions';
import { type Contact } from '../domain/model';
import { copyText } from '../platform/files';
export function Support() {
  return (
    <PrivateGate>
      <SupportList />
    </PrivateGate>
  );
}
function SupportList() {
  const { data } = useVault();
  const [editing, setEditing] = useState<Contact | null>(null);
  const [message, setMessage] = useState<Contact | null>(null);
  const { run, busy } = useAction();
  const { notify } = useApp();
  if (!data) return null;
  const contacts = [...data.contacts].sort((a, b) => a.order - b.order);
  async function move(index: number, shift: number) {
    const list = [...contacts];
    [list[index], list[index + shift]] = [list[index + shift], list[index]];
    await run(() =>
      vault.change((d) => {
        d.contacts = list.map((c, order) => ({ ...c, order }));
      }),
    );
  }
  return (
    <>
      <PageTitle
        eyebrow="No tienes que hacerlo a solas"
        description="Acuerda en calma cómo pedir apoyo. Si alguien no responde, puedes probar con otra persona."
      >
        Mi red de apoyo
      </PageTitle>
      <div className="section-heading">
        <SafeLink to="/emergency" className="button secondary">
          Ver emergencias
        </SafeLink>
        <button
          className="button primary"
          disabled={contacts.length >= 100}
          onClick={() =>
            setEditing({
              id: newId(),
              displayName: '',
              role: 'personal',
              channels: [{ type: 'tel', value: '' }],
              order: contacts.length,
              updatedAt: now(),
            })
          }
        >
          <Plus size={18} aria-hidden="true" /> Agregar contacto
        </button>
      </div>
      {contacts.length === 0 ? (
        <EmptyState title="Aquí hay espacio para tu compañía">
          <p>Agrega a alguien cercano o a tu profesional tratante cuando quieras.</p>
        </EmptyState>
      ) : (
        <div className="support-grid">
          {contacts.map((contact, index) => (
            <article className="panel contact-card" key={contact.id}>
              <p className="eyebrow">
                {contact.role === 'professional' ? 'Profesional' : 'Persona cercana'}
                {data.plan.priorityContactIds[0] === contact.id && ' · apoyo principal'}
              </p>
              <h2>{contact.displayName}</h2>
              <p className="phone-number">{contact.channels[0].value}</p>
              {contact.availabilityText && <p>{contact.availabilityText}</p>}
              <div className="button-row">
                <a
                  className="button primary"
                  href={phoneDestination(contact.channels[0].value, 'tel')}
                >
                  <Phone size={18} aria-hidden="true" /> Llamar a {contact.displayName}
                </a>
                <button className="button secondary" onClick={() => setMessage(contact)}>
                  <MessageCircle size={18} aria-hidden="true" /> Preparar mensaje
                </button>
              </div>
              <div className="button-row">
                <button className="text-button" onClick={() => setEditing(contact)}>
                  Editar contacto
                </button>
                <button
                  className="text-button"
                  disabled={busy}
                  onClick={() =>
                    void run(() =>
                      vault.change((d) => {
                        d.plan.priorityContactIds = [
                          contact.id,
                          ...d.plan.priorityContactIds.filter((id) => id !== contact.id),
                        ];
                      }),
                    )
                  }
                >
                  <Star size={16} aria-hidden="true" /> Elegir principal
                </button>
                <button
                  className="icon-button"
                  disabled={index === 0 || busy}
                  aria-label={`Subir a ${contact.displayName}`}
                  onClick={() => void move(index, -1)}
                >
                  <ArrowUp size={18} aria-hidden="true" />
                </button>
                <button
                  className="icon-button"
                  disabled={index === contacts.length - 1 || busy}
                  aria-label={`Bajar a ${contact.displayName}`}
                  onClick={() => void move(index, 1)}
                >
                  <ArrowDown size={18} aria-hidden="true" />
                </button>
              </div>
              {data.plan.personalEmergencyContactIds.includes(contact.id) && (
                <p className="subtle">Recurso añadido por ti · sin verificación oficial</p>
              )}
            </article>
          ))}
        </div>
      )}
      {editing && (
        <Dialog
          title={
            data.contacts.some((c) => c.id === editing.id) ? 'Editar contacto' : 'Agregar contacto'
          }
          onClose={() => setEditing(null)}
        >
          <ContactEditor contact={editing} onClose={() => setEditing(null)} />
        </Dialog>
      )}
      {message && (
        <Dialog title="Tu solicitud de apoyo" onClose={() => setMessage(null)}>
          <MessageComposer contact={message} onClose={() => setMessage(null)} />
        </Dialog>
      )}
      <p className="subtle">
        Las llamadas y mensajes dependen de tu dispositivo y su cobertura. Refugio no puede
        confirmar si alguien recibió tu solicitud.
      </p>
      <button
        className="text-button"
        onClick={async () => {
          const text = contacts.map((c) => `${c.displayName}: ${c.channels[0].value}`).join('\n');
          if (
            window.confirm(
              'El portapapeles puede ser visible para otras apps. ¿Copiar tus contactos?',
            )
          )
            notify(
              (await copyText(text))
                ? 'Contactos copiados. Revisa la privacidad de tu portapapeles.'
                : 'No se pudo copiar. Puedes seleccionar los números en pantalla.',
            );
        }}
      >
        Copiar contactos con aviso de privacidad
      </button>
    </>
  );
}
function ContactEditor({ contact, onClose }: { contact: Contact; onClose: () => void }) {
  const returnHome = useReturnHomeAfterSave();
  const { data } = useVault();
  const { draft, setDraft, clean, changed } = useDraftState(structuredClone(contact));
  const [emergency, setEmergency] = useState(
    data!.plan.personalEmergencyContactIds.includes(contact.id),
  );
  const { run, busy } = useAction();
  const existing = data!.contacts.some((c) => c.id === contact.id);
  const patch = (p: Partial<Contact>) => setDraft({ ...draft, ...p });
  return (
    <form
      className="form-stack"
      onSubmit={async (e) => {
        e.preventDefault();
        if (
          await run(() =>
            vault.change((d) => {
              saveContact(d, { ...draft, updatedAt: now() });
              d.plan.personalEmergencyContactIds = [
                ...d.plan.personalEmergencyContactIds.filter((id) => id !== contact.id),
                ...(emergency ? [contact.id] : []),
              ];
            }),
          )
        ) {
          clean();
          returnHome();
        }
      }}
    >
      <TextField
        label="Nombre o alias"
        value={draft.displayName}
        onChange={(displayName) => patch({ displayName })}
        maxLength={100}
        required
      />
      <label className="field">
        Tipo de apoyo
        <select
          value={draft.role}
          onChange={(e) => patch({ role: e.target.value as Contact['role'] })}
        >
          <option value="personal">Persona cercana</option>
          <option value="professional">Profesional tratante</option>
        </select>
      </label>
      <TextField
        label="Teléfono"
        value={draft.channels[0].value}
        onChange={(value) =>
          patch({
            channels: [
              { type: 'tel', value },
              { type: 'sms', value },
            ],
          })
        }
        required
        type="tel"
        maxLength={32}
        help="Incluye el código de país cuando lo conozcas. Ejemplo ficticio: +57 300 000 0000."
      />
      <TextField
        label="Disponibilidad acordada (opcional)"
        value={draft.availabilityText ?? ''}
        onChange={(availabilityText) => patch({ availabilityText })}
      />
      <TextField
        label="Mensaje de apoyo (opcional)"
        multiline
        maxLength={1000}
        value={draft.supportMessage ?? ''}
        onChange={(supportMessage) => patch({ supportMessage })}
      />
      <label className="field">
        Contacto alternativo
        <select
          value={draft.alternateContactId ?? ''}
          onChange={(e) => patch({ alternateContactId: e.target.value || undefined })}
        >
          <option value="">Sin contacto alternativo</option>
          {data!.contacts
            .filter((c) => c.id !== contact.id)
            .map((c) => (
              <option key={c.id} value={c.id}>
                {c.displayName}
              </option>
            ))}
        </select>
      </label>
      <Check checked={emergency} onChange={setEmergency}>
        Guardar también como recurso personal de emergencia, sin verificación oficial.
      </Check>
      <div className="button-row">
        <button className="button primary" disabled={busy}>
          Guardar contacto y volver al inicio
        </button>
        <button
          type="button"
          onClick={() => {
            if (!changed || window.confirm('¿Descartar los cambios sin guardar?')) {
              clean();
              onClose();
            }
          }}
        >
          Cancelar
        </button>
        {existing && (
          <button
            type="button"
            className="danger-text"
            disabled={busy}
            onClick={async () => {
              if (window.confirm('¿Eliminar este contacto y sus referencias en tu plan?'))
                if (
                  await run(
                    () => vault.change((d) => removeContact(d, contact.id)),
                    'Contacto eliminado.',
                  )
                ) {
                  clean();
                  onClose();
                }
            }}
          >
            Eliminar contacto
          </button>
        )}
      </div>
    </form>
  );
}
export function MessageComposer({ contact, onClose }: { contact: Contact; onClose: () => void }) {
  const [message, setMessage] = useState(
    contact.supportMessage ||
      'Estoy pasando por un momento difícil. ¿Puedes acompañarme o hablar un rato conmigo?',
  );
  const { notify } = useApp();
  return (
    <div className="form-stack">
      <p>
        Revisa el mensaje para <strong>{contact.displayName}</strong> · {contact.channels[0].value}.
        Se abrirá tu app de mensajes; tú decides si enviarlo.
      </p>
      <TextField
        label="Mensaje para pedir apoyo"
        value={message}
        onChange={setMessage}
        maxLength={1000}
        multiline
      />
      <div className="button-row">
        <a
          className="button primary"
          href={phoneDestination(contact.channels[0].value, 'sms', message)}
        >
          Abrir mensajes
        </a>
        <button
          className="button secondary"
          onClick={async () => {
            if (
              window.confirm(
                'El portapapeles puede compartirse con otras apps. ¿Copiar este mensaje?',
              )
            )
              notify(
                (await copyText(message))
                  ? 'Mensaje copiado; no se envió a nadie.'
                  : 'No se pudo copiar. Selecciona el texto del campo.',
              );
          }}
        >
          Copiar mensaje
        </button>
        {'share' in navigator && (
          <button
            onClick={async () => {
              try {
                await navigator.share({ text: message });
              } catch {
                /* Cancelar el panel no implica entrega. */
              }
            }}
          >
            Abrir panel para compartir
          </button>
        )}
        <button onClick={onClose}>Cerrar</button>
      </div>
      <p className="subtle">
        Cerrar el panel o abrir otra app no confirma el envío ni la recepción.
      </p>
    </div>
  );
}
