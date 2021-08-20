import { MouseEvent, FormEvent, useState, ChangeEvent, memo } from 'react';
import styles from './newsletterForm.module.scss';
import cn from 'classnames';
import { Loader } from './loader/Loader';
import { subscribeToNewsletter } from './utils/api';

export const NewsletterForm = memo(() => {
  const [inputValue, setInputValue] = useState('');
  const [status, setStatus] = useState('normal');
  const [title, setTitle] = useState('Subskrybuj');
  const [isLoading, setLoadingState] = useState(false);

  const handleInputChange = (e: ChangeEvent<HTMLInputElement>) => {
    setInputValue(e.target.value);
  };

  const handleSubmit = async (
    e: MouseEvent<HTMLButtonElement, MouseEvent> | FormEvent<HTMLFormElement>,
  ) => {
    e.preventDefault();
    setInputValue('');
    setLoadingState(true);

    const res = await subscribeToNewsletter(inputValue);
    const { error } = await res.json();

    if (error) {
      setTitle('Wystąpił błąd');
      setStatus('error');
      setLoadingState(false);
      return;
    }

    setLoadingState(false);
    setTitle('Subskrybujesz!');
    setStatus('success');
  };

  return (
    <form className={styles.wrapper} onSubmit={handleSubmit}>
      <label className={styles.inputLabelWrapper}>
        <input
          type="email"
          required
          autoComplete="email"
          value={inputValue}
          className={styles.input}
          onChange={handleInputChange}
          aria-invalid={status === 'error'}
          placeholder="Email"
        />
        <span className="visually-hidden">Email</span>
      </label>
      <button disabled={isLoading} className={cn(styles.button, styles[status])}>
        {isLoading ? <Loader /> : <span>{title}</span>}
      </button>
    </form>
  );
});

NewsletterForm.displayName = 'NewsletterForm';