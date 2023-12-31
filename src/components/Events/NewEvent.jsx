import { useMutation } from '@tanstack/react-query';
import { Link, useNavigate } from 'react-router-dom';
import { createNewEvent, queryClient } from '../../util/http.js';
import ErrorBlock from '../UI/ErrorBlock.jsx';

import Modal from '../UI/Modal.jsx';
import EventForm from './EventForm.jsx';

export default function NewEvent() {
  
  const { mutate, isPending, isError, error } = useMutation({
    // Don't really need caching here not necessary
    // mutationKey ,
    mutationFn: createNewEvent,

    onSuccess: () => {
      // makes so only queries with exactly events are retriggered exact: true
      queryClient.invalidateQueries({queryKey: ['events']});
      navigate('/events');
    }
  });
  
  const navigate = useNavigate();

  function handleSubmit(formData) {
    mutate({ event: formData });
    
  }

  return (
    <Modal onClose={() => navigate('../')}>
      <EventForm onSubmit={handleSubmit}>
        {isPending && 'Submitting'}
        {!isPending && (
        <>
          <Link to="../" className="button-text">
            Cancel
          </Link>
          <button type="submit" className="button">
            Create
          </button>
        </>
        )
      }
      </EventForm>
      {isError && <ErrorBlock title="Failed to create event" message={error.info?.message || 'Failed to create event! Please check inputs and try again later.'} />}
    </Modal>
  );
}
