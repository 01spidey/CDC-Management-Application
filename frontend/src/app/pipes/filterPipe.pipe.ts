import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'filter',
})
export class FilterPipe implements PipeTransform {
  transform(items: any[], searchText: string): any[] {
    if (!items || !searchText) {
      return items;
    }

    searchText = searchText.toLowerCase();

    return items.filter((item) => {
      // Apply your custom filtering logic here
      // For example, check if any of the properties contain the search text
      return (
        item.position.toLowerCase().includes(searchText) ||
        item.date.toLowerCase().includes(searchText) ||
        item.staff_id.toLowerCase().includes(searchText) ||
        item.company.toLowerCase().includes(searchText) ||
        item.HR_name.toLowerCase().includes(searchText) ||
        item.HR_mail.toLowerCase().includes(searchText) ||
        item.message.toLowerCase().includes(searchText) ||
        item.contact_mode.toLowerCase().includes(searchText)
      );
    });
  }
}
