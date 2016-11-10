import Ember from 'ember';
import NotifierMixin from '../../../mixins/notifier';

export default Ember.Controller.extend(NotifierMixin, {
	documentService: Ember.inject.service('document'),

	actions: {
		onCancel() {
			this.transitionToRoute('document');
		},

		onAddSection(section) {
			this.audit.record("added-section-" + section.get('contentType'));

			let page = {
				documentId: this.get('model.document.id'),
				title: `${section.get('title')}`,
				level: 1,
				sequence: 0,
				body: "",
				contentType: section.get('contentType'),
				pageType: section.get('pageType')
			};

			let data = this.get('store').normalize('page', page);
			let pageData = this.get('store').push(data);

			let meta = {
				documentId: this.get('model.document.id'),
				rawBody: "",
				config: ""
			};

			let pageMeta = this.get('store').normalize('page-meta', meta);
			let pageMetaData = this.get('store').push(pageMeta);

			let model = {
				page: pageData,
				meta: pageMetaData
			};

			this.get('documentService').addPage(this.get('model.document.id'), model).then((newPage) => {
				let options = {};
				options['mode'] = 'edit';
				this.transitionToRoute('document.section', newPage.id,  { queryParams: options });
			});
		}
	}
});
