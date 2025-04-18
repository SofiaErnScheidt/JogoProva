const canvas = document.getElementById('JogoCanvas');
const ctx = canvas.getContext('2d');

class Entidade {
    constructor(x, y, largura, altura, cor) {
        this.x = x;
        this.y = y;
        this.largura = largura;
        this.altura = altura;
        this.cor = cor;
    }

    desenhar() {
        ctx.fillStyle = this.cor;
        ctx.fillRect(this.x, this.y, this.largura, this.altura);
    }
}

// Classe para o Jogador
class Jogador extends Entidade {
    constructor(x, y, largura, altura, cor, velocidade) {
        super(x, y, largura, altura, cor);
        this.velocidade = velocidade;
    }

    mover(direcao) {
        if (direcao === 'esquerda' && this.x > 0) {
            this.x -= this.velocidade;
        } else if (direcao === 'direita' && this.x + this.largura < canvas.width) {
            this.x += this.velocidade;
        }
    }
}

// Classe para Projetil
class Projetil extends Entidade {
    constructor(x, y, largura, altura, cor, velocidade) {
        super(x, y, largura, altura, cor);
        this.velocidade = velocidade;
    }

    atualizar() {
        this.y -= this.velocidade;
    }
}

// Classe para os Aliens
class Alien extends Entidade {
    constructor(x, y, largura, altura, cor, velocidade) {
        super(x, y, largura, altura, cor);
        this.velocidade = velocidade;
    }

    atualizar() {
        this.y += this.velocidade
    }
}

// Iniciando o Jogo
const jogador = new Jogador(canvas.width / 2 - 25, canvas.height - 60, 50, 50, 'white', 5);
const aliens = [];
const projeteis = [];

function gerarAlien() {
    const x = Math.random() * (canvas.width - 40)
    aliens.push(new Alien(x, 0, 40, 40, 'gray', 2))
}

setInterval(gerarAlien, 4000)

function loop() {
    ctx.clearRect(0, 0, canvas.width, canvas.height)

    jogador.desenhar()

    projeteis.forEach((projetil, index) => {
        projetil.atualizar();
        projetil.desenhar();
        if (projetil.y < 0) {
            projeteis.splice(index, 1)
        }
    })

    aliens.forEach((alien, indexAlien) => {
        alien.atualizar();
        alien.desenhar();

        projeteis.forEach((projetil, indexProjetil) => {
            if (
                projetil.x < alien.x + alien.largura &&
                projetil.x + projetil.largura > alien.x &&
                projetil.y < alien.y + alien.altura &&
                projetil.y + projetil.altura > alien.y
            ) {
                aliens.splice(indexAlien, 1)
                projeteis.splice(indexProjetil, 1)
            }
        })

        // Verificar se o alien chegou ao fundo
        if (alien.y + alien.altura >= canvas.height) {
            alert('Game Over!')
            aliens.splice(indexAlien, 1)
        }
    })

    requestAnimationFrame(loop)
    
}

document.addEventListener('keydown', (event) => {
    if (event.key === 'ArrowLeft') {
        jogador.mover('esquerda');
    } else if (event.key === 'ArrowRight') {
        jogador.mover('direita');
    } else if (event.key === ' ') {
        projeteis.push(new Projetil(jogador.x + jogador.largura / 2 - 5, jogador.y, 10, 20, 'black', 7));
    }
});

loop()
