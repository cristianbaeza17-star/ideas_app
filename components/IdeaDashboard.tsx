
import React, { useState, useEffect, useCallback } from 'react';
import { supabase } from '../services/supabase';
import { Session } from '@supabase/supabase-js';
import { Idea } from '../types';
import Spinner from './Spinner';
import LogoutIcon from './icons/LogoutIcon';

interface IdeaDashboardProps {
  session: Session;
}

const IdeaDashboard: React.FC<IdeaDashboardProps> = ({ session }) => {
  const [ideas, setIdeas] = useState<Idea[]>([]);
  const [newIdeaContent, setNewIdeaContent] = useState('');
  const [loading, setLoading] = useState(true);
  const [formLoading, setFormLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchIdeas = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const { data, error } = await supabase
        .from('ideas')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setIdeas(data || []);
    } catch (error: any) {
      setError('No se pudieron cargar las ideas. Inténtalo de nuevo más tarde.');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchIdeas();
  }, [fetchIdeas]);

  const handleSignOut = async () => {
    await supabase.auth.signOut();
  };

  const handleIdeaSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!newIdeaContent.trim()) return;

    setFormLoading(true);
    setError(null);

    try {
      const { data, error } = await supabase
        .from('ideas')
        .insert([{ content: newIdeaContent, user_id: session.user.id }])
        .select();

      if (error) throw error;
      
      if(data) {
        setIdeas(prevIdeas => [data[0], ...prevIdeas]);
      }
      setNewIdeaContent('');

    } catch (error: any) {
      setError('No se pudo guardar la idea. Inténtalo de nuevo.');
    } finally {
      setFormLoading(false);
    }
  };
  
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('es-ES', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  return (
    <div className="container mx-auto max-w-4xl p-4 sm:p-6 lg:p-8">
      <header className="flex justify-between items-center mb-8">
        <div>
            <h1 className="text-3xl font-bold text-white">Bóveda de Ideas</h1>
            <p className="text-gray-400 text-sm break-all">Hola, {session.user.email}</p>
        </div>
        <button
          onClick={handleSignOut}
          className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-gray-300 bg-gray-800 rounded-md hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 focus:ring-offset-gray-900"
        >
          <LogoutIcon />
          <span>Cerrar sesión</span>
        </button>
      </header>

      <main>
        <div className="bg-gray-800 p-6 rounded-lg shadow-lg mb-8">
          <form onSubmit={handleIdeaSubmit}>
            <label htmlFor="idea" className="block text-lg font-medium text-gray-200 mb-2">
              ¿Cuál es tu nueva idea?
            </label>
            <textarea
              id="idea"
              rows={4}
              value={newIdeaContent}
              onChange={(e) => setNewIdeaContent(e.target.value)}
              placeholder="Ej: Una app para conectar a dueños de mascotas..."
              className="w-full p-3 bg-gray-900 border border-gray-700 rounded-md focus:ring-indigo-500 focus:border-indigo-500 text-gray-100 placeholder-gray-500"
            />
            <button
              type="submit"
              disabled={formLoading || !newIdeaContent.trim()}
              className="mt-4 w-full sm:w-auto float-right px-6 py-2.5 text-sm font-semibold text-white bg-indigo-600 rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 focus:ring-offset-gray-800 disabled:bg-indigo-400 disabled:cursor-not-allowed"
            >
              {formLoading ? <Spinner /> : 'Guardar Idea'}
            </button>
          </form>
          {error && <p className="mt-4 text-sm text-red-400">{error}</p>}
        </div>

        <div className="space-y-4">
          <h2 className="text-2xl font-bold text-white">Tus Ideas Guardadas</h2>
          {loading ? (
            <div className="text-center py-8">
              <Spinner />
            </div>
          ) : ideas.length === 0 ? (
            <div className="text-center py-8 px-4 bg-gray-800 rounded-lg">
                <p className="text-gray-400">Aún no has guardado ninguna idea. ¡Empieza a crear!</p>
            </div>
          ) : (
            <ul className="space-y-4">
              {ideas.map((idea) => (
                <li key={idea.id} className="bg-gray-800 p-5 rounded-lg shadow-md transition-transform hover:scale-[1.02]">
                  <p className="text-gray-200 whitespace-pre-wrap">{idea.content}</p>
                  <p className="text-right text-xs text-gray-500 mt-3">{formatDate(idea.created_at)}</p>
                </li>
              ))}
            </ul>
          )}
        </div>
      </main>
    </div>
  );
};

export default IdeaDashboard;
