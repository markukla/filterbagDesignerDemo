import { SearchDirectiveWithRandomChars } from './search-directive-with-random-chars.directive';

describe('ProductSearchDirective', () => {
  it('should create an instance', () => {
    const directive = new SearchDirectiveWithRandomChars();
    expect(directive).toBeTruthy();
  });
});
