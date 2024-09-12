class RecintosZoo {
  constructor() {
      this.recintos = [
          { numero: 1, bioma: "savana", tamanhoTotal: 10, animaisExistentes: [{ especie: "MACACO", quantidade: 3 }] },
          { numero: 2, bioma: "floresta", tamanhoTotal: 5, animaisExistentes: [] },
          { numero: 3, bioma: "savana e rio", tamanhoTotal: 7, animaisExistentes: [{ especie: "GAZELA", quantidade: 1 }] },
          { numero: 4, bioma: "rio", tamanhoTotal: 8, animaisExistentes: [] },
          { numero: 5, bioma: "savana", tamanhoTotal: 9, animaisExistentes: [{ especie: "LEAO", quantidade: 1 }] }
      ];

      this.animais = {
          LEAO: { tamanho: 3, bioma: ["savana"], carnivoro: true },
          LEOPARDO: { tamanho: 2, bioma: ["savana"], carnivoro: true },
          CROCODILO: { tamanho: 3, bioma: ["rio"], carnivoro: true },
          MACACO: { tamanho: 1, bioma: ["savana", "floresta"], carnivoro: false },
          GAZELA: { tamanho: 2, bioma: ["savana"], carnivoro: false },
          HIPOPOTAMO: { tamanho: 4, bioma: ["savana", "rio"], carnivoro: false }
      };
  }

  analisaRecintos(animal, quantidade) {
      if (!this.animais[animal]) {
          return { erro: "Animal inválido" };
      }
      if (quantidade <= 0) {
          return { erro: "Quantidade inválida" };
      }

      const recintosViaveis = this.recintos
          .filter(recinto => this.aceitaAnimal(recinto, animal, quantidade))
          .map(recinto => {
              const espacoLivre = this.avaliarEspacoLivre(recinto, animal, quantidade);
              return `Recinto ${recinto.numero} (espaço livre: ${espacoLivre} total: ${recinto.tamanhoTotal})`;
          });

      if (recintosViaveis.length === 0) {
          return { erro: "Não há recinto viável" };
      }

      return { recintosViaveis };
  }

  aceitaAnimal(recinto, animal, quantidade) {
      const animalInfo = this.animais[animal];
      const espacoNecessario = animalInfo.tamanho * quantidade;
      const espacoDisponivel = this.avaliarEspacoLivre(recinto);

      if (espacoDisponivel < espacoNecessario) {
          return false;
      }

      if (!animalInfo.bioma.some(b => recinto.bioma.includes(b))) {
          return false;
      }

      if (animalInfo.carnivoro && recinto.animaisExistentes.some(a => a.especie !== animal)) {
          return false;
      }

      if (!animalInfo.carnivoro && recinto.animaisExistentes.some(a => this.animais[a.especie].carnivoro)) {
          return false;
      }

      return true;
  }

      avaliarEspacoLivre(recinto, novoAnimal = null, novaQuantidade = 0) {
        const espacoOcupado = this.calcularEspacoOcupado(recinto);
        const espacoNovoAnimal = this.calcularEspacoNovoAnimal(novoAnimal, novaQuantidade);
        const espacoExtra = this.calcularEspacoExtra(recinto, novoAnimal);
        
        return recinto.tamanhoTotal - espacoOcupado - espacoNovoAnimal - espacoExtra;
      }
      
      calcularEspacoOcupado(recinto) {
        return recinto.animaisExistentes.reduce((total, animal) => {
          return total + this.animais[animal.especie].tamanho * animal.quantidade;
        }, 0);
      }
      
      calcularEspacoNovoAnimal(novoAnimal, novaQuantidade) {
        return novoAnimal ? this.animais[novoAnimal].tamanho * novaQuantidade : 0;
      }
      
      calcularEspacoExtra(recinto, novoAnimal) {
        if (recinto.animaisExistentes.length > 0) {
          const outrosAnimais = recinto.animaisExistentes.some(a => a.especie !== novoAnimal);
          const multipleSpecies = recinto.animaisExistentes.length > 1;
          return (novoAnimal && outrosAnimais) || (novoAnimal === null && multipleSpecies) ? 1 : 0;
        }
        return 0;
      }
      
}

export { RecintosZoo as RecintosZoo };
