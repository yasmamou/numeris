import React from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { addDoc, collection } from 'firebase/firestore';
import { db } from '../firebase';
import { useAuth } from '../contexts/AuthContext';
import { useNavigate } from 'react-router-dom';

const schema = z.object({
  title: z.string().min(1, "Le titre est requis"),
  description: z.string().min(10, "La description doit contenir au moins 10 caractères"),
  tags: z.string().transform(val => val.split(',').map(tag => tag.trim())),
});

type CreateProjectFormData = z.infer<typeof schema>;

const CreateProject: React.FC = () => {
  const { register, handleSubmit, formState: { errors } } = useForm<CreateProjectFormData>({
    resolver: zodResolver(schema),
  });
  const { currentUser } = useAuth();
  const navigate = useNavigate();

  const onSubmit = async (data: CreateProjectFormData) => {
    if (!currentUser) return;

    try {
      await addDoc(collection(db, "projects"), {
        ...data,
        creatorId: currentUser.uid,
        createdAt: new Date(),
        participants: [currentUser.uid],
        status: 'ideation',
      });
      navigate('/dashboard');
    } catch (error) {
      console.error("Erreur lors de la création du projet:", error);
    }
  };

  return (
    <div className="max-w-2xl mx-auto">
      <h2 className="text-2xl font-bold mb-4">Créer un nouveau projet</h2>
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <div>
          <label htmlFor="title" className="block mb-1">Titre du projet</label>
          <input
            type="text"
            id="title"
            {...register('title')}
            className="w-full px-3 py-2 border rounded-lg"
          />
          {errors.title && <p className="text-red-500 text-sm mt-1">{errors.title.message}</p>}
        </div>
        <div>
          <label htmlFor="description" className="block mb-1">Description</label>
          <textarea
            id="description"
            {...register('description')}
            className="w-full px-3 py-2 border rounded-lg"
            rows={4}
          ></textarea>
          {errors.description && <p className="text-red-500 text-sm mt-1">{errors.description.message}</p>}
        </div>
        <div>
          <label htmlFor="tags" className="block mb-1">Tags (séparés par des virgules)</label>
          <input
            type="text"
            id="tags"
            {...register('tags')}
            className="w-full px-3 py-2 border rounded-lg"
          />
          {errors.tags && <p className="text-red-500 text-sm mt-1">{errors.tags.message}</p>}
        </div>
        <button type="submit" className="w-full bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 transition-colors">
          Créer le projet
        </button>
      </form>
    </div>
  );
};

export default CreateProject;