export enum tagType {
  Premium = 0x1 << 0,
  New = 0x1 << 1,
  Fresh = 0x1 << 2,
  Ending = 0x1 << 3,
  Trending = 0x1 << 4,
  Trusted = 0x1 << 5
}

export interface Tag {
  type: tagType;
  name: string;
  order: number;
  color?: string;
  icon?: string;
  tooltip?: string;
}

export const tag_list: { [key: number]: Tag } = {
  0x1: {
    type: tagType.Premium,
    name: 'Premium',
    order: 10,
    color: 'amber-400',
    icon: 'dollar-sign',
    tooltip: 'El usuario es premium'
  },
  0x2: {
    type: tagType.New,
    name: 'Nuevo',
    order: 40,
    color: 'light-blue-400',
    icon: 'certificate',
    tooltip: 'El producto es nuevo'
  },
  0x4: {
    type: tagType.Fresh,
    name: 'Reciente',
    order: 50,
    color: 'light-green-500',
    icon: 'baby',
    tooltip: 'La publicación es nueva'
  },
  0x8: {
    type: tagType.Ending,
    name: 'Por Terminar',
    order: 60,
    color: 'teal-600',
    icon: 'exclamation',
    tooltip: 'La publicación está por terminar'
  },
  0x10: {
    type: tagType.Trending,
    name: 'Trending',
    order: 20,
    color: 'purple-500',
    icon: 'signal',
    tooltip: 'La publicación está siendo muy visitada'
  },
  0x20: {
    type: tagType.Trusted,
    name: 'Confiable',
    order: 30,
    color: 'red-400',
    icon: 'user-check',
    tooltip: 'El usuario es considerado como confiable'
  }
};

export const tag_order = Object.keys(tag_list).sort((a, b) => tag_list[+b].order - tag_list[+a].order);
