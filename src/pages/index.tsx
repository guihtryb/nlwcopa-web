import Image from "next/image";
import AppPreviewImage from '../assets/app-preview.png';
import logoNlwCopa from '../assets/logo.svg';
import userAvatarImageExample from '../assets/icon-avatars-example.png';
import iconCheckImg from '../assets/icon-check.svg'
import { api } from "../lib/axios";
import { FormEvent, useState } from "react";

interface HomeProps {
  pollCount: number;
  guessCount: number;
  userCount: number;
}

export default function Home(props: HomeProps) {
  const [pollTitle, setpollTitle] = useState('');
  
  async function createpoll(event: FormEvent) {
    event.preventDefault();

    try {
      const response = await api.post('/polls', {
        title: pollTitle,
      });
      const { code } = response.data;

      await navigator.clipboard.writeText(code);
      alert('Bolão criado com sucesso! Código copiado para a área de transferência')
      setpollTitle('');
    } catch (error) {
      alert('Falha ao criar o bolão, tente novamente!')
    }
  }

  return (
    <div className="max-w-[1124px] h-screen mx-auto grid grid-cols-2 items-center">
      <main>
        <Image
          src={logoNlwCopa}
          alt="NLW Copa"
          quality={100}
        />

        <h1
          className="mt-14 text-white text-5xl font-bold leading-tight"
        >
          Crie seu próprio bolão da copa e compartilhar entre amigos!
        </h1>

        <div className="mt-10 flex items-center gap-2">
          <Image
            src={userAvatarImageExample}
            alt="Exemplos de ícones de usuário"
          />

          <strong className="text-gray-100 text-xl">
            <span  className="text-ignite-500">
              +{props.userCount}
            </span>
          {' '} pessoas já estão usando.
          </strong>
        </div>

        <form onSubmit={createpoll} className="mt-10 flex justify-start gap-2">
          <input type="text" required placeholder="Qual nome do seu bolão?"  className="flex-1 px-4 py-4 rounded bg-gray-800 border border-gray-600 text-sm text-gray-100" onChange={(event) => setpollTitle(event.target.value)}
          value={pollTitle}
          />
          <button type="submit" className="bg-yellow-500 px-4 py-4 rounded text-gray-900 uppercase font-bold hover:bg-yellow-700 transition-all">Criar meu bolão</button>
        </form>

        <p className="text-gray-300 mt-4 text-sm leading-relaxed">Após criar seu bolão, você receberá um código único que poderá usar para convidar outras pessoas 🚀</p>

        <div className="mt-10 pt-10 border-t border-gray-600 flex items-center justify-between text-gray-100">
          <div  className="flex items-center gap-6">
            <Image src={iconCheckImg} alt="" />
            <div className="flex flex-col">
              <span className="font-bold text-2xl">+{props.pollCount}</span>
              <span>Bolões criados</span>
            </div>
          </div>

          <div className="w-px h-10 bg-gray-600" />

          <div  className="flex items-center gap-6">
            <Image src={iconCheckImg} alt="" />
            <div className="flex flex-col">
              <span className="font-bold text-2xl">+{props.guessCount}</span>
              <span>Palpites enviados</span>
            </div>
          </div>
        </div>
      </main>

      <Image
        src={AppPreviewImage}
        alt="Dois celulares exibindo uma prévia da aplicação móvel"
        quality={100}
      />
    </div>
  )
}

export const getStaticProps = async () => {
  const [
    pollCountResponse,
    guessesCountResponse,
    usersCountResponse,
  ] = await Promise.all(
    [
      api.get('/polls/count'),
      api.get('/guesses/count'),
      api.get('/users/count')
    ]
  );

  return {
    props: {
      pollCount: pollCountResponse.data.count,
      guessCount: guessesCountResponse.data.count,
      userCount: usersCountResponse.data.count,
    },
    revalidate: 60,
  }
}
