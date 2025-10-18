import { Link } from 'react-router-dom';
import 'Home.css';
import { useState } from 'react';

import CustomButton from '../components/common/Button';
import Input from '../components/common/Input';

export default function Home() {
  const [name, setName] = useState('');
  return (
    <div className="home-container">
      <section className="home-header">
        <h1>One day, you'll be cool</h1>
      </section>

      <section className="home-content">
        <p>Suena música de edit de tiktok</p>
        <div style={{ flexDirection: 'column', width: '310px' }}>
          <Input
            label="Nombre completo"
            labelSize="small"
            value={name}
            onChange={e => setName(e.target.value)}
            variant="outlined"
            fullWidth
          />
        </div>
        <div style={{ display: 'flex', gap: '1rem', marginTop: '1rem' }}>
          <CustomButton variant="primary" size="small">
            Guardar
          </CustomButton>
          <CustomButton variant="secondary" size="small">
            Cancelar
          </CustomButton>
          <CustomButton variant="disabled" size="small">
            Deshabilitado
          </CustomButton>
        </div>
      </section>
    </div>
  );
}
