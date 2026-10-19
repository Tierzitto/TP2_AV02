export interface EventoRecomendacao {
  tipo: string;
  dados: Record<string, unknown>;
  origem: string;
  timestamp: Date;
}
