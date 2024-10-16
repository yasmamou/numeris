import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { createUserWithEmailAndPassword } from 'firebase/auth';
import { setDoc, doc } from 'firebase/firestore';
import { auth, db } from '../firebase';
import { useNavigate } from 'react-router-dom';

const schema = z.object({
  email: z.string().email({ message: "Email invalide" }),
  password: z.string().min(6, { message: "Le mot de passe doit contenir au moins 6 caractères" }),
  confirmPassword: z.string(),
  userType: z.enum(['chercheur', 'medecin', 'institutionnel', 'startup', 'businessAngel', 'laboratoire', 'administratif']),
}).refine((data) => data.password === data.confirmPassword, {
  message: "Les mots de passe ne correspondent pas",
  path: ["confirmPassword"],
});

type RegisterFormData = z.infer<typeof schema>;

const Register: React.FC = () => {
  const { register, handleSubmit, formState: { errors } } = useForm<RegisterFormData>({
    resolver: zodResolver(schema),
  });
  const navigate = useNavigate();
  const [error, setError] = useState<string | null>(null);

  const onSubmit = async (data: RegisterFormData) => {
    try {
      const userCredential = await createUserWithEmailAndPassword(auth, data.email, data.password);
      const user = userCredential.user;

      await setDoc(doc(db, "users", user.uid), {
        email: data.email,
        userType: data.userType,
        createdAt: new Date(),
      });

      navigate('/dashboard');
    } catch (error) {
      console.error("Erreur d'inscription:", error);
      setError("Une erreur s'est produite lors de l'inscription. Veuillez réessayer.");
    }
  };

  return (
    <div className="max-w-md mx-auto">
      <h2 className="text-2xl font-bold mb-4">Inscription</h2>
      {error && <p className="text-red-500 mb-4">{error}</p>}
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <div>
          <label htmlFor="email" className="block mb-1">Email</label>
          <input
            type="email"
            id="email"
            {...register('email')}
            className="w-full px-3 py-2 border rounded-lg"
          />
          {errors.email && <p className="text-red-500 text-sm mt-1">{errors.email.message}</p>}
        </div>
        <div>
          <label htmlFor="password" className="block mb-1">Mot de passe</label>
          <input
            type="password"
            id="password"
            {...register('password')}
            className="w-full px-3 py-2 border rounded-lg"
          />
          {errors.password && <p className="text-red-500 text-sm mt-1">{errors.password.message}</p>}
        </div>
        <div>
          <label htmlFor="confirmPassword" className="block mb-1">Confirmer le mot de passe</label>
          <input
            type="password"
            id="confirmPassword"
            {...register('confirmPassword')}
            className="w-full px-3 py-2 border rounded-lg"
          />
          {errors.confirmPassword && <p className="text-red-500 text-sm mt-1">{errors.confirmPassword.message}</p>}
        </div>
        <div>
          <label htmlFor="userType" className="block mb-1">Type d'utilisateur</label>
          <select
            id="userType"
            {...register('userType')}
            className="w-full px-3 py-2 border rounded-lg"
          >
            <option value="chercheur">Chercheur</option>
            <option value="medecin">Médecin</option>
            <option value="institutionnel">Institutionnel</option>
            <option value="startup">Startup</option>
            <option value="businessAngel">Business Angel</option>
            <option value="laboratoire">Laboratoire</option>
            <option value="administratif">Administratif</option>
          </select>
          {errors.userType && <p className="text-red-500 text-sm mt-1">{errors.userType.message}</p>}
        </div>
        <button type="submit" className="w-full bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 transition-colors">
          S'inscrire
        </button>
      </form>
    </div>
  );
};

export default Register;