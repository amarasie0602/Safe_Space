import { useState } from 'react';
import Icon from './Icon';

const RecoveryCodeDialog = ({ recoveryCode, onContinue }) => {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(recoveryCode);
      setCopied(true);
    } catch {
      // Clipboard access can fail (permissions, insecure context) — the code
      // stays visible on screen either way, so this is a nice-to-have only.
    }
  };

  return (
    <div className="dialog-overlay">
      <div className="dialog" role="alertdialog" aria-modal="true" aria-labelledby="recovery-title">
        <h2 id="recovery-title">Save your recovery code</h2>
        <p>
          There's no email on an anonymous account, so this code is the only way to reset your
          password if you forget it. It won't be shown again after you continue.
        </p>
        <div className="recovery-code">{recoveryCode}</div>
        <div className="card-actions">
          <button type="button" className="btn btn-ghost" onClick={handleCopy}>
            <Icon name="bookmark" size={14} /> {copied ? 'Copied' : 'Copy code'}
          </button>
          <button type="button" className="btn btn-primary" onClick={onContinue}>
            I've saved it, continue
          </button>
        </div>
      </div>
    </div>
  );
};

export default RecoveryCodeDialog;
