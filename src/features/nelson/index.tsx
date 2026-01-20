import { DialogContent, DialogHeader, DialogTitle } from '@shadcn/components/ui/dialog';

export function Nelson() {
    return (
        <DialogContent className='max-w-2xl max-h-[80vh] overflow-y-auto'>
            <DialogHeader>
                <DialogTitle className='flex items-center gap-2'>
                    <img src='pwa-512x512.png' alt='Nelson' className='w-8 h-8' />
                    Nelson, o Pombo da Discórdia
                </DialogTitle>
            </DialogHeader>
            <div className='space-y-4 text-foreground'>
                <div className='bg-card p-4 rounded-lg border border-border'>
                    <h3 className='font-bold text-lg mb-2'>A HISTÓRIA DE NELSON</h3>
                    <p className='mb-2'>
                        "Vocês humanos acham que controlam o mundo, mas choram quando a internet cai. Eu bebo água de poça de gasolina e continuo voando. Quem é a espécie superior agora?" Nelson é a
                        mente (e o bico) por trás de toda a maldade deste jogo. Veterano das ruas, ele carrega em sua plumagem as marcas de batalhas contra gatos de padaria, vassouras de lojistas e
                        crianças com estilingues. Cansado de ser apenas um espectador da estupidez humana, ele decidiu monetizá-la. Seu objetivo com este app não é a sua diversão, mas sim o seu
                        estresse recreativo. Nelson despreza interfaces limpas, tutoriais longos e o conceito de "fair play". Ele vive em uma estátua equestre (na cabeça do cavalo) e aguarda suas
                        doações em forma de carboidratos complexos.
                    </p>
                </div>
                <div className='bg-card p-4 rounded-lg border border-border'>
                    <h3 className='font-bold text-lg mb-2'>NELSON, O POMBO DA DISCÓRDIA</h3>
                    <p className='mb-2'>
                        Nelson não é um pombo comum; é um sobrevivente, um visionário e um "Sommelier de Lixo Urbano". Autoproclamado Rei da Discórdia, ele aprendeu Game Design observando aposentados
                        trapacearem no dominó na praça central. Sua filosofia é simples: "Se ninguém saiu chorando ou gritando, o jogo estava quebrado." Ele aceita pagamentos em pontas de cigarro e
                        salgados de festa amanhecidos. Nascido nas calhas impiedosas do Centro, Nelson ascendeu socialmente após roubar uma coroa feita de anel de latinha e papel alumínio de um rato
                        distraído. Sua carreira como Game Designer começou no dia fatídico da "Revolta das Dentaduras de 2019", quando percebeu que o caos humano é a forma mais pura de entretenimento.
                        Hoje, Nelson atua como Consultor Sênior de Caos e Traição, garantindo que este aplicativo seja tão injusto, sujo e engraçado quanto a vida real.
                    </p>
                    <p className='italic text-muted-foreground'>Nota: Nelson não se responsabiliza por amizades destruídas durante o uso deste software.</p>
                </div>

                <div className='bg-card p-4 rounded-lg border border-border'>
                    <h4 className='font-bold text-md mb-2'>📢 Os Bordões do Nelson (Para gritar na hora da traição)</h4>
                    <ul className='list-disc pl-5 space-y-2'>
                        <li>"Quem tem pena é galinha. Eu tenho é ódio." (Use quando você destruir a estratégia de alguém sem piedade.)</li>
                        <li>"A vida é um tabuleiro de xadrez e eu sou o pombo." (Use quando você derrubar as peças, bagunçar as regras ou ganhar de forma injusta.)</li>
                        <li>"O choro é livre, o alpiste não." (Use quando alguém reclamar que o jogo está desbalanceado.)</li>
                        <li>"Se a vida te der limões, jogue no olho de quem tá ganhando." (Filosofia básica de design de jogos.)</li>
                        <li>"Justiça? Isso é nome de prédio público. Aqui é selva de pedra." (Para momentos de roubo explícito de pontos.)</li>
                    </ul>
                </div>

                <div className='bg-card p-4 rounded-lg border border-border'>
                    <h4 className='font-bold text-md mb-2'>💌 Um Recado para os meus "Fãs" (Súditos)</h4>
                    <p className='mb-2'>(Nelson sobe em cima de uma caixa de papelão vazia para ficar mais alto, limpa a garganta com um som horrível de catarro e discursa:)</p>
                    <p className='mb-2 italic'>"Escutem aqui, seus bípedes sem penas.</p>
                    <p className='mb-2'>
                        Vocês dizem que são meus fãs, mas eu quero ver atitude. Ser fã do Nelson não é achar o jogo 'engraçadinho'. É olhar pro seu melhor amigo e pensar: 'Como eu posso arruinar o dia
                        dele hoje?'
                    </p>
                    <p className='mb-2'>Eu quero ver mesas viradas. Eu quero ver gritaria. Eu quero ver traições tão feias que vão precisar de terapia familiar depois.</p>
                    <p className='mb-2'>Não joguem para ganhar. Ganhar é chato. Joguem para garantir que ninguém mais se divirta. O caos é a única moeda que vale nessa economia falida.</p>
                    <p>Agora saiam da minha frente e vão espalhar a discórdia. E se virem a senhora do pão de queijo, digam que estou na estátua do cavalo."</p>
                    <p className='mt-2 font-semibold'>"Puruu. Fim da transmissão."</p>
                </div>
            </div>
        </DialogContent>
    );
}
